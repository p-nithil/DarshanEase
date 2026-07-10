const Temple = require('../models/Temple');

// @desc    Get all temples (with search, filter, and sorting)
// @route   GET /api/temples
// @access  Public
exports.getTemples = async (req, res, next) => {
  try {
    const { search, state, darshanType, sort } = req.query;
    let query = { isActive: true };

    // Search filter (name, location, state)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    // State filter
    if (state && state !== 'All') {
      query.state = { $regex: `^${state}$`, $options: 'i' };
    }

    // Darshan type filter
    if (darshanType && darshanType !== 'All') {
      query['darshanTypes.name'] = { $regex: darshanType, $options: 'i' };
    }

    let queryBuilder = Temple.find(query);

    // Sorting
    if (sort) {
      if (sort === 'priceAsc') {
        // Sort by the minimum ticket price in darshanTypes array
        // In MongoDB, sorting by a field in an array of objects sorts by the min/max element.
        // We will default to sorting by ticketPrice or using specific logic.
        // Let's sort by name or location for simplicity, or we can sort by 'darshanTypes.price'
        queryBuilder = queryBuilder.sort({ 'darshanTypes.price': 1 });
      } else if (sort === 'priceDesc') {
        queryBuilder = queryBuilder.sort({ 'darshanTypes.price': -1 });
      } else if (sort === 'name') {
        queryBuilder = queryBuilder.sort({ name: 1 });
      }
    } else {
      queryBuilder = queryBuilder.sort({ createdAt: -1 }); // Default newest
    }

    const temples = await queryBuilder;

    res.status(200).json({
      success: true,
      count: temples.length,
      data: temples
    });
  } catch (error) {
    console.error('GetTemples error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving temples' });
  }
};

// @desc    Get single temple
// @route   GET /api/temples/:id
// @access  Public
exports.getTempleById = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    res.status(200).json({
      success: true,
      data: temple
    });
  } catch (error) {
    console.error('GetTempleById error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Temple not found' });
    }
    res.status(500).json({ success: false, message: 'Server error retrieving temple' });
  }
};

// @desc    Create new temple
// @route   POST /api/temples
// @access  Private/Admin
exports.createTemple = async (req, res, next) => {
  try {
    const temple = await Temple.create(req.body);

    res.status(201).json({
      success: true,
      data: temple
    });
  } catch (error) {
    console.error('CreateTemple error:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A temple with this name already exists'
      });
    }
    res.status(500).json({ success: false, message: 'Server error creating temple' });
  }
};

// @desc    Update temple
// @route   PUT /api/temples/:id
// @access  Private/Admin
exports.updateTemple = async (req, res, next) => {
  try {
    let temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    temple = await Temple.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: temple
    });
  } catch (error) {
    console.error('UpdateTemple error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating temple' });
  }
};

// @desc    Delete temple (Soft or Hard delete)
// @route   DELETE /api/temples/:id
// @access  Private/Admin
exports.deleteTemple = async (req, res, next) => {
  try {
    const temple = await Temple.findById(req.params.id);

    if (!temple) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      });
    }

    // Hard delete temple for complete administration
    await Temple.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Temple deleted successfully'
    });
  } catch (error) {
    console.error('DeleteTemple error:', error.message);
    res.status(500).json({ success: false, message: 'Server error deleting temple' });
  }
};
