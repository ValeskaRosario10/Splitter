// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzlmNzI4OTgzYzdhNjAxN2FmYjYyMDciLCJpYXQiOjE3Mzg1MTM2MTIsImV4cCI6MTczODUxNzIxMn0.kIz5bqIB3PE4MTBWdzx80H2xM1sqUJOdNfTR5c_405A


require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
 // Import auth routes

const app = express();

// Middleware
app.use(express.json()); // Allow JSON requests


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Test route
app.get('/', (req, res) => {
  res.send('Hello, Splitwise Backend is working!');
});
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); 
const groupRoutes = require('./routes/groupRoutes');
app.use('/api/groups', groupRoutes);
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
