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

// --- SOCKET.IO SETUP ---
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('⚡ A user connected:', socket.id);
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/purchase', require('./routes/purchaseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

const Message = require('./models/message'); 

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

app.post('/api/messages', async (req, res) => {
  try {
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

// 👇 THE FIX: Connect to DB *first*, THEN start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ LinkServe DB Connected");
    // Only listen once DB is ready
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
    console.error("❌ DB Connection Error:", err);
});