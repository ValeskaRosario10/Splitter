const express = require('express');
const Settlement = require('../models/Settlement');
const router = express.Router();

// DELETE: Revert a settlement
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Settlement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Settlement not found' });
    res.json({ message: 'Settlement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete settlement', details: err.message });
  }
});

// DELETE: Revert a settlement
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Settlement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Settlement not found' });
    res.json({ message: 'Settlement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete settlement', details: err.message });
  }
});

module.exports = router;

module.exports = router;
