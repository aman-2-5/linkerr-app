const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io'); // Import Socket.io
const http = require('http'); // Import HTTP module
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// --- ROUTES ---
// Auth & Users
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Core Features
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Utilities
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Chat System
app.use('/api/messages', require('./routes/messageRoutes'));

// --- 🔌 SOCKET.IO SETUP (Real-Time Chat) ---
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow connections from any frontend
    methods: ["GET", "POST"]
  }
});

// Store online users: Map<userId, socketId>
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // 1. User Connects (Store their Socket ID)
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log(`⚡ User connected: ${userId}`);
  });

  // 2. User Sends Message
  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    
    if (sendUserSocket) {
      // ✅ CRITICAL FIX: We now send the message AND the sender's ID ('from')
      // This allows the frontend to know who sent the message for notifications
      socket.to(sendUserSocket).emit("msg-recieve", { 
        msg: data.msg, 
        from: data.from 
      });
    }
  });

  // 3. User Disconnects
  socket.on("disconnect", () => {
    // Optional: You can remove the user from onlineUsers here if needed
  });
});

const PORT = process.env.PORT || 10000;
// Note: We use 'server.listen' (HTTP+Socket) instead of 'app.listen'
server.listen(PORT, () => console.log(`🚀 Socket Server running on port ${PORT}`));