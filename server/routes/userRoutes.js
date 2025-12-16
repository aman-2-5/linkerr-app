// @route   PUT /api/users/connect/:id
// @desc    Connect with another user (Follow logic)
router.put('/connect/:id', async (req, res) => {
  const { currentUserId } = req.body; // The ID of the person clicking "Connect"
  const targetUserId = req.params.id; // The ID of the person being connected to

  if (currentUserId === targetUserId) {
    return res.status(400).json({ error: "You cannot connect with yourself" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // Check if already connected
    if (!currentUser.connections.includes(targetUserId)) {
      await currentUser.updateOne({ $push: { connections: targetUserId } });
      await targetUser.updateOne({ $push: { connections: currentUserId } });
      res.status(200).json({ message: "Connected successfully!" });
    } else {
      res.status(400).json({ error: "Already connected" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});