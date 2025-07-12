//routes/expenseRoutes.js

const express = require('express');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Group = require('../models/Group');
const router = express.Router();

// Add a new expense
router.post('/add', async (req, res) => {
  try {
    let { description, amount, paidBy, group, splitBetween = [] } = req.body;

    // 1️⃣  Basic payload validation
    if (!description || !amount || !paidBy || !group) {
      return res.status(400).json({ error: 'description, amount, paidBy, and group are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: 'amount must be positive' });
    }

    // 2️⃣  Ensure the payer is in the split and remove duplicates
    splitBetween = [...new Set([...splitBetween, paidBy])];

    // 3️⃣  Check group exists and payer is a member
    const groupDoc = await Group.findById(group);
    if (!groupDoc) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (!groupDoc.members.includes(paidBy)) {
      return res.status(403).json({ error: 'Payer must belong to the group' });
    }

    // 4️⃣  Verify every user ID in splitBetween belongs to the group
    const invalid = splitBetween.find(id => !groupDoc.members.includes(id));
    if (invalid) {
      return res.status(403).json({ error: `User ${invalid} is not a member of this group` });
    }

    // 5️⃣  Save expense
    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      group,
      splitBetween,
    });

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add expense', details: err.message });
  }
});

// PATCH: Update an expense
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense updated', expense: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update expense', details: err.message });
  }
});

// DELETE: Soft-delete an expense (optional: add `deleted: true` flag in schema)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense', details: err.message });
  }
});



module.exports = router;