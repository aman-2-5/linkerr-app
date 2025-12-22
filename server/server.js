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

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 👇 THE NEW ORDER ROUTE (Make sure this line exists!)
app.use('/api/orders', require('./routes/orderRoutes'));

// ❌ DELETE OR REMOVE THIS LINE IF YOU SEE IT:
// app.use('/api/purchase', require('./routes/purchaseRoutes')); 

const PORT = process.env.PORT || 10000; // Render uses 10000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));