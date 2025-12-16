const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // <--- New Import
const { Server } = require("socket.io"); // <--- New Import
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ LinkServe DB Connected"))
.catch(err => console.error(err));

// --- SOCKET.IO SETUP ---
const server = http.createServer(app); // Wrap express app
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from anywhere (for now)
    methods: ["GET", "POST"]
  }
});

// Store active socket connections (User ID -> Socket ID)
let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  // When a user logs in, they send their UserID
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is actively chatting.`);
  });

  // Handle sending messages
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      // Send to the specific user instantly
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    // Optional: remove user from onlineMap
  });
});
// -----------------------

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/purchase', require('./routes/purchaseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/search', require('./routes/searchRoutes')); // Search Route

// Quick Route to Get Chat History (We'll add a full route file later if needed)
const Message = require('./models/Message');
app.get('/api/messages/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: from, recipient: to },
        { sender: to, recipient: from }
      ]
    }).sort({ createdAt: 1 }); // Oldest first
    res.json(messages);
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      text: message,
      sender: from,
      recipient: to
    });
    if (data) return res.json({ msg: "Message added successfully." });
    return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
});

const PORT = process.env.PORT || 5000;
// Note: We listen on 'server', not 'app' now!
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));