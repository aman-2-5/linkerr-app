const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoute = require('./routes/userRoutes');
const serviceRoute = require('./routes/serviceRoutes');
const app = express();
const purchaseRoute = require('./routes/purchaseRoutes');
const authRoute = require('./routes/authRoutes'); // <--- ADD THIS

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ LinkServe DB Connected (Atlas)"))
  .catch((err) => console.log("❌ Connection Error:", err));

// Routes Placeholder (We will add the purchase route later)
app.use('/api/purchase', purchaseRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute); // <--- ADD THIS
app.use('/api/posts', require('./routes/postRoutes'));
//app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', serviceRoute);
app.get('/', (req, res) => {
  res.send('LinkServe API is Running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});