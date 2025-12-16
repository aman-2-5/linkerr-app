const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require("socket.io"); 
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
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// Store active socket connections
let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is actively chatting.`);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
// -----------------------

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/purchase', require('./routes/purchaseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// 👇 FIX 1: Lowercase 'message' to match filename 'message.js'
const Message = require('./models/message'); 

// Get Chat History
app.get('/api/messages/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: from, recipient: to },
        { sender: to, recipient: from }
      ]
    }).sort({ createdAt: 1 }); 
    res.json(messages);
  } catch (ex) {
    res.status(500).json({error: ex.message});
  }
});

// Add Message
app.post('/api/messages', async (req, res) => {
  try {
    // 👇 FIX 2: Variable name 'message' conflicts with imported model 'Message'
    // I changed the destructuring to { message: msgText } to avoid conflict
    const { from, to, message: msgText } = req.body; 
    
    const data = await Message.create({
      text: msgText,
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
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));