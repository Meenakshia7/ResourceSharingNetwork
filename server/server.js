const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files for image access
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const loanRoutes = require('./routes/loan'); 
const reviewRoutes = require('./routes/review');

app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/reviews', reviewRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB connected');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
})
.catch((err) => {
  console.error(' MongoDB connection failed:', err.message);
});
