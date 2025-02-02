const express = require('express');
const Group = require('../models/Group');
const User = require('../models/User');
const router = express.Router();




const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your secret key here
      req.user = decoded.user; // Add user info to request object
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  };
// Create a new group
router.post('/create', verifyToken,async (req, res) => {
  try {
    const { name, members } = req.body;
    
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

module.exports = router;
