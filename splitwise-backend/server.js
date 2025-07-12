// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODQzZDhlMjlhODFjNDIxMjY2NzUxMDYiLCJpYXQiOjE3NDkyNzcwMjEsImV4cCI6MTc0OTI4MDYyMX0.Yax7HfrmYTd-vHvhkCLD_AgmF-KnUCNvzezcLD1NuC8

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODVhYTQ4ODA3YzhlOTMxZTAwMzZjYzciLCJpYXQiOjE3NTA3NzA4NTIsImV4cCI6MTc1MDc3NDQ1Mn0.knhD8EuSPHdQOgKmqAQG92j7QPqFX9oL1tnF-dwOOCQ
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
  app.use('/auth', authRoutes); 
  const groupRoutes = require('./routes/groupRoutes');
  app.use('/groups', groupRoutes);
  const expenseRoutes = require('./routes/expenseRoutes');
  app.use('/expenses', expenseRoutes);
const settlementRoutes = require('./routes/settlementRoutes');
app.use('/settlements', settlementRoutes);


  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// {
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODVhYWI1NTgxM2NhYzI0OWMyNGFkMGMiLCJpYXQiOjE3NTA3NzI1NzgsImV4cCI6MTc1MDc3NjE3OH0.L5rNDzQQctDxkGPVcTZ9uoFV8jqKJWYVr6ZUW5K4E6Q",
//     "message": "Login successful"
// }

// {
//   "name": "Ludo",
//   "email": "ludo@example.com",
//   "password": "ludo"
// }

// {
//     "message": "Group created successfully",
//     "group": {
//         "name": "Trip to Goa",
//         "members": [
//             "685aab55813cac249c24ad0c",
//             "685aa48807c8e931e0036cc7",
//             "679f728983c7a6017afb6207"
//         ],
//         "_id": "685aac05813cac249c24ad10",
//         "createdAt": "2025-06-24T13:45:41.067Z",
//         "updatedAt": "2025-06-24T13:45:41.067Z",
//         "__v": 0
//     }
// }