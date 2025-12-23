const express = require('express');
const router = express.Router();
const Message = require('../models/message'); // Ensure you have the model file

// @route   POST /api/messages
// @desc    Add a message to the database
router.post('/', async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to database" });
  } catch (ex) {
    next(ex);
  }
});

// @route   GET /api/messages/:from/:to
// @desc    Get chat history between two users
router.get('/:from/:to', async (req, res) => {
  try {
    const { from, to } = req.params;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        text: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

module.exports = router;