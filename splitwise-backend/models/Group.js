//models//group.js

const mongoose = require('mongoose');

// Define the Group schema
const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  }],
}, {
  timestamps: true  // Adds createdAt and updatedAt fields
});

// Create the Group model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
