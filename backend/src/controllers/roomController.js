const ShoppingRoom = require('../models/ShoppingRoom');

// @desc    Get all shopping rooms
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) query.status = status;

    const rooms = await ShoppingRoom.find(query)
      .populate('seller', 'username email avatar')
      .populate('products', 'name price images')
      .sort({ scheduledTime: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single shopping room
// @route   GET /api/rooms/:id
// @access  Public
const getRoom = async (req, res) => {
  try {
    const room = await ShoppingRoom.findById(req.params.id)
      .populate('seller', 'username email avatar')
      .populate('products');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create shopping room
// @route   POST /api/rooms
// @access  Private/Seller
const createRoom = async (req, res) => {
  try {
    const { title, description, products, scheduledTime, maxViewers } = req.body;

    const room = await ShoppingRoom.create({
      title,
      description,
      products,
      scheduledTime,
      maxViewers,
      seller: req.user._id
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shopping room
// @route   PUT /api/rooms/:id
// @access  Private/Seller
const updateRoom = async (req, res) => {
  try {
    const room = await ShoppingRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check ownership
    if (room.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this room' });
    }

    const updatedRoom = await ShoppingRoom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete shopping room
// @route   DELETE /api/rooms/:id
// @access  Private/Seller
const deleteRoom = async (req, res) => {
  try {
    const room = await ShoppingRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check ownership
    if (room.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this room' });
    }

    await room.deleteOne();
    res.json({ message: 'Room removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Start shopping room
// @route   POST /api/rooms/:id/start
// @access  Private/Seller
const startRoom = async (req, res) => {
  try {
    const room = await ShoppingRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check ownership
    if (room.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to start this room' });
    }

    room.status = 'live';
    room.startedAt = Date.now();
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    End shopping room
// @route   POST /api/rooms/:id/end
// @access  Private/Seller
const endRoom = async (req, res) => {
  try {
    const room = await ShoppingRoom.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check ownership
    if (room.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to end this room' });
    }

    room.status = 'ended';
    room.endedAt = Date.now();
    room.currentViewers = 0;
    await room.save();

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  startRoom,
  endRoom
};
