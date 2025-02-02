const mongoose = require('mongoose');

// Define the Expense schema
const expenseSchema = new mongoose.Schema({
  description: { type: String,required: true,trim: true,},
  amount: { type: Number, required: true,},
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true,}, 
                                                // Reference to the User model (who paid the expense)
   
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group',  required: true,},
     // Reference to the Group model (which group the expense belongs to)
   
  splitBetween: [{  type: mongoose.Schema.Types.ObjectId,  ref: 'User',   required: true,
  }],
},
    // Users who are splitting the expense
    {
  timestamps: true,  // Adds createdAt and updatedAt fields
});

// Create the Expense model
const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
