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

















// // // GET all expenses of a group
// // router.get('/:groupId/expenses', async (req, res) => {
// //   const groupId = req.params.groupId;
// //   try {
// //     const expenses = await Expense.find({ group: groupId })
// //       .populate('paidBy', 'name')
// //       .populate('splitBetween', 'name');
// //     res.json(expenses);
// //   } catch (err) {
// //     res.status(500).json({ message: 'Error fetching expenses', err });
// //   }
// // });

// const express = require('express');
// const Expense = require('../models/Expense');
// const User = require('../models/User');
// const Group = require('../models/Group');
// const router = express.Router();

// // ✅ ✅ ✅ Place ALL routes BEFORE module.exports

// // // GET all expenses of a group
// router.get('/:groupId/expenses', async (req, res) => {
//   const groupId = req.params.groupId;
//   try {
//     const expenses = await Expense.find({ group: groupId })
//       .populate('paidBy', 'name')
//       .populate('splitBetween', 'name');
//     res.json(expenses);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching expenses', err });
//   }
// });

// module.exports = router;