const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io'); // 👈 Import Socket.io
const http = require('http'); // 👈 Import HTTP module
require('dotenv').config();

const app = express();
const server = http.createServer(app); // 👈 Create HTTP server

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 👇 NEW: Message Routes
app.use('/api/messages', require('./routes/messageRoutes'));

// --- 🔌 SOCKET.IO SETUP (The Real-Time Brain) ---
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow connections from anywhere (Frontend)
    methods: ["GET", "POST"]
  }
});

// Store online users: Map<userId, socketId>
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  // 1. User Connects
  socket.on("add-user", (userId) => {
    global.onlineUsers.set(userId, socket.id);
    console.log(`⚡ User connected: ${userId}`);
  });

  // 2. User Sends Message
  socket.on("send-msg", (data) => {
    const sendUserSocket = global.onlineUsers.get(data.to);
    if (sendUserSocket) {
      // If user is online, send immediately
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  // 3. User Disconnects
  socket.on("disconnect", () => {
    // Optional: cleanup user from map
  });
});

const PORT = process.env.PORT || 10000;
// 👇 CHANGE: Use 'server.listen' instead of 'app.listen'
server.listen(PORT, () => console.log(`🚀 Socket Server running on port ${PORT}`));