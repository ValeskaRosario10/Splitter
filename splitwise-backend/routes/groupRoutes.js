//routes/groupRoutes.js

const express = require('express');
const Expense = require('../models/Expense');
const Group = require('../models/Group');
const User = require('../models/User');
const Settlement =require('../models/Settlement');
const router = express.Router();


const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received token:', token);  // Log token here

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);  // Log error here
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Create a new group
router.post('/create', verifyToken,async (req, res) => {
  try {
    let { name, members } = req.body;
     if (!members.includes(req.user.userId)) {
      members.push(req.user.userId);
    }
    // Check if all members are valid users
    const validMembers = await User.find({ '_id': { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ error: 'Invalid member(s) provided.' });
    }

    const newGroup = new Group({
      name,
      members,
    });

    await newGroup.save();
    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create group', err });
  }
});

router.get('/:groupId/expenses', async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const expenses = await Expense.find({ group: groupId })
      .populate('paidBy', 'name')
      .populate('splitBetween', 'name');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses', err });
  }
});

router.post('/:groupId/settle', verifyToken, async (req, res) => {
  const { groupId } = req.params;
  const { from, to, amount } = req.body;

  // 1. Basic validation
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'from, to, and amount are required' });
  }
  if (from === to) {
    return res.status(400).json({ error: 'from and to cannot be the same user' });
  }
  if (amount <= 0) {
    return res.status(400).json({ error: 'amount must be positive' });
  }

  try {
    // 2. Ensure group exists
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // 3. Ensure both users belong to the group
    if (!group.members.includes(from) || !group.members.includes(to)) {
      return res.status(403).json({ error: 'Both users must belong to this group' });
    }

    // 4. Record settlement
    const settlement = await Settlement.create({
      from,
      to,
      amount,
      group: groupId,
    });

    return res.status(201).json({
      message: 'Settlement recorded',
      settlement,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', err });
  }
});


// Calculate who owes whom in a group
router.get('/:groupId/balances', verifyToken, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const expenses = await Expense.find({ group: groupId });

    // Step 1: Calculate net balances per user
    const balances = {};
    expenses.forEach(expense => {
      const amountPerUser = expense.amount / expense.splitBetween.length;
      
      // Credited to payer
      if (!balances[expense.paidBy]) balances[expense.paidBy] = 0;
      balances[expense.paidBy] += expense.amount;

      // Debited from split users
      expense.splitBetween.forEach(userId => {
        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= amountPerUser;
      });
    });

    // Step 2: Simplify debts (Splitwise's "Simplify Debts" algorithm)
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([userId, balance]) => {
      if (balance > 0) creditors.push({ userId, amount: balance });
      else if (balance < 0) debtors.push({ userId, amount: -balance });
    });

    // Step 3: Generate transactions
    const transactions = [];
    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      const minAmount = Math.min(creditor.amount, debtor.amount);

      transactions.push({
        from: debtor.userId,
        to: creditor.userId,
        amount: parseFloat(minAmount.toFixed(2))
      });

      creditor.amount -= minAmount;
      debtor.amount -= minAmount;

      if (creditor.amount < 0.01) i++;
      if (debtor.amount < 0.01) j++;
    }

    res.json({ balances, transactions });
  } catch (err) {
    res.status(500).json({ error: "Failed to calculate balances", details: err.message });
  }
});


// PATCH: Update group name or members
router.patch('/:groupId', verifyToken, async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.groupId, req.body, { new: true });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group updated', group });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update group', details: err.message });
  }
});

// DELETE: Archive/delete a group
router.delete('/:groupId', verifyToken, async (req, res) => {
  try {
    const deleted = await Group.findByIdAndDelete(req.params.groupId);
    if (!deleted) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete group', details: err.message });
  }
});

module.exports = router;

