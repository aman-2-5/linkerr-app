const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// --- ROUTES ---

// 👇 AUTH & USERS (Crucial for Login!)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 👇 CORE FEATURES
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 👇 UTILS (Search, Uploads, Reviews)
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));