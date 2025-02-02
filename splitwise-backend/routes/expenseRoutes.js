const express = require('express');
const Expense = require('../models/Expense');
const User = require('../models/User');
const Group = require('../models/Group');
const router = express.Router();

// Add a new expense
router.post('/add', async (req, res) => {
  try {
    const { description, amount, paidBy, group, splitBetween } = req.body;

    // Check if the group exists
    const groupExists = await Group.findById(group);
    if (!groupExists) {
      return res.status(400).json({ error: 'Group not found' });
    }

    // Check if all users are valid
    const validUsers = await User.find({ '_id': { $in: [paidBy, ...splitBetween] } });
    if (validUsers.length !== [paidBy, ...splitBetween].length) {
      return res.status(400).json({ error: 'Invalid user(s) provided.' });
    }

    const newExpense = new Expense({
      description,
      amount,
      paidBy,
      group,
      splitBetween,
    });

    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense', err });
  }
});

module.exports = router;
