const Event = require('../models/Event');
const Museum = require('../models/Museum');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// ======================
// EVENT MANAGEMENT CONTROLLERS
// ======================

/**
 * @desc    Get all events with filtering, pagination, and sorting
 * @route   GET /api/events
 * @access  Museum Admin or Super Admin
 */
const getAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'schedule.startDate',
      sortOrder = 'desc',
      status,
      type,
      category,
      search,
      museumId
    } = req.query;

    // Build query
    const query = {};

    // Museum filter (for museum admins) - TEMPORARILY DISABLED FOR DEBUGGING
    // if (req.user.role !== 'superAdmin') {
    //   if (!req.user.museumId) {
    //     return res.status(403).json({
    //       success: false,
    //       message: 'User not associated with any museum'
    //     });
    //   }
    //   query.museum = req.user.museumId;
    // } else if (museumId) {
    //   query.museum = museumId;
    // }

    // TEMPORARY: Show all events for debugging

    // Status filter
    if (status) {
      query.status = status;
    }

    // Type filter
    if (type) {
      query.type = type;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const events = await Event.find(query)
      .populate('museum', 'name location')
      .populate('organizer', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: events,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

/**
 * @desc    Get event by ID
 * @route   GET /api/events/:id
 * @access  Museum Admin or Super Admin
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('museum', 'name location')
      .populate('organizer', 'name email')
      .populate('attendees.user', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to this event
    if (req.user.role !== 'superAdmin' && event.museum.toString() !== req.user.museumId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this event'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

/**
 * @desc    Create new event
 * @route   POST /api/events
 * @access  Museum Admin or Super Admin
 */
const createEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      type,
      category,
      schedule,
      location,
      registration,
      media,
      speakers,
      sponsors,
      tags,
      visibility,
      featured,
      requirements,
      contact,
      notes
    } = req.body;

    // Determine museum ID
    let museumId;
    if (req.user.role === 'superAdmin') {
      museumId = req.body.museum || req.user.museumId;
    } else {
      if (!req.user.museumId) {
        return res.status(403).json({
          success: false,
          message: 'User not associated with any museum'
        });
      }
      museumId = req.user.museumId;
    }

    // Verify museum exists
    const museum = await Museum.findById(museumId);
    if (!museum) {
      return res.status(404).json({
        success: false,
        message: 'Museum not found'
      });
    }

    // Create event
    const event = new Event({
      title,
      description,
      museum: museumId,
      organizer: req.user._id,
      type,
      category,
      schedule,
      location,
      registration,
      media,
      speakers,
      sponsors,
      tags,
      visibility,
      featured,
      requirements,
      contact,
      notes
    });

    await event.save();

    // Populate the created event
    await event.populate([
      { path: 'museum', select: 'name location' },
      { path: 'organizer', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      data: event,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

/**
 * @desc    Update event
 * @route   PUT /api/events/:id
 * @access  Museum Admin or Super Admin
 */
const updateEvent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to this event
    if (req.user.role !== 'superAdmin' && event.museum.toString() !== req.user.museumId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this event'
      });
    }

    // Update event fields
    const allowedUpdates = [
      'title', 'description', 'type', 'category', 'schedule', 'location',
      'registration', 'media', 'speakers', 'sponsors', 'tags', 'status',
      'visibility', 'featured', 'requirements', 'contact', 'notes'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    // Populate the updated event
    await event.populate([
      { path: 'museum', select: 'name location' },
      { path: 'organizer', select: 'name email' }
    ]);

    res.json({
      success: true,
      data: event,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

/**
 * @desc    Delete event
 * @route   DELETE /api/events/:id
 * @access  Museum Admin or Super Admin
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user has access to this event
    if (req.user.role !== 'superAdmin' && event.museum.toString() !== req.user.museumId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this event'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

/**
 * @desc    Get event statistics
 * @route   GET /api/events/stats
 * @access  Museum Admin or Super Admin
 */
const getEventStats = async (req, res) => {
  try {
    const { museumId, startDate, endDate } = req.query;

    // Build query
    const query = {};
    if (req.user.role !== 'superAdmin') {
      if (!req.user.museumId) {
        return res.status(403).json({
          success: false,
          message: 'User not associated with any museum'
        });
      }
      query.museum = req.user.museumId;
    } else if (museumId) {
      query.museum = museumId;
    }

    // Date range filter
    if (startDate || endDate) {
      query['schedule.startDate'] = {};
      if (startDate) query['schedule.startDate'].$gte = new Date(startDate);
      if (endDate) query['schedule.startDate'].$lte = new Date(endDate);
    }

    // Get basic counts
    const totalEvents = await Event.countDocuments(query);
    const activeEvents = await Event.countDocuments({ ...query, status: 'published' });
    const upcomingEvents = await Event.countDocuments({
      ...query,
      'schedule.startDate': { $gte: new Date() },
      status: 'published'
    });

    // Get registration statistics
    const registrationStats = await Event.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRegistrations: { $sum: '$registration.currentRegistrations' },
          totalCapacity: { $sum: '$registration.capacity' },
          totalRevenue: {
            $sum: {
              $multiply: [
                '$registration.currentRegistrations',
                { $ifNull: ['$registration.fees.adult', 0] }
              ]
            }
          }
        }
      }
    ]);

    const stats = registrationStats[0] || {
      totalRegistrations: 0,
      totalCapacity: 0,
      totalRevenue: 0
    };

    // Get events by type
    const eventsByType = await Event.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get events by status
    const eventsByStatus = await Event.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        activeEvents,
        upcomingEvents,
        totalRegistrations: stats.totalRegistrations,
        totalCapacity: stats.totalCapacity,
        totalRevenue: stats.totalRevenue,
        eventsByType,
        eventsByStatus
      }
    });
  } catch (error) {
    console.error('Get event stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event statistics',
      error: error.message
    });
  }
};

/**
 * @desc    Get event types and categories
 * @route   GET /api/events/types-categories
 * @access  Public
 */
const getEventTypesAndCategories = async (req, res) => {
  try {
    const eventTypes = [
      'exhibition',
      'workshop',
      'lecture',
      'tour',
      'conference',
      'cultural_event',
      'educational_program',
      'special_exhibition',
      'community_event',
      'virtual_event',
      'other'
    ];

    const categories = [
      'art',
      'history',
      'culture',
      'archaeology',
      'science',
      'education',
      'entertainment',
      'community',
      'research',
      'preservation'
    ];

    res.json({
      success: true,
      data: {
        types: eventTypes,
        categories
      }
    });
  } catch (error) {
    console.error('Get event types and categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event types and categories',
      error: error.message
    });
  }
};

/**
 * @desc    Register user for event
 * @route   POST /api/events/:id/register
 * @access  Authenticated
 */
const registerForEvent = async (req, res) => {
  try {
    const { ticketType = 'general', specialRequirements } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Event is not available for registration'
      });
    }

    if (event.registration.required && event.isFull) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    const existingAttendee = event.attendees.find(
      a => a.user.toString() === req.user._id.toString()
    );

    if (existingAttendee) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered for this event'
      });
    }

    // Add attendee
    event.attendees.push({
      user: req.user._id,
      ticketType,
      specialRequirements,
      status: 'registered'
    });

    if (event.registration.required) {
      event.registration.currentRegistrations += 1;
    }

    event.statistics.totalRegistrations += 1;
    await event.save();

    res.json({
      success: true,
      message: 'Successfully registered for event',
      data: {
        eventId: event._id,
        registrationId: event.attendees[event.attendees.length - 1]._id
      }
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel event registration
 * @route   DELETE /api/events/:id/register
 * @access  Authenticated
 */
const cancelEventRegistration = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const attendeeIndex = event.attendees.findIndex(
      a => a.user.toString() === req.user._id.toString()
    );

    if (attendeeIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'User is not registered for this event'
      });
    }

    // Remove attendee
    event.attendees.splice(attendeeIndex, 1);

    if (event.registration.required) {
      event.registration.currentRegistrations = Math.max(
        0,
        event.registration.currentRegistrations - 1
      );
    }

    await event.save();

    res.json({
      success: true,
      message: 'Successfully cancelled event registration'
    });
  } catch (error) {
    console.error('Cancel event registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel event registration',
      error: error.message
    });
  }
};

/**
 * @desc    Add event review
 * @route   POST /api/events/:id/review
 * @access  Authenticated
 */
const addEventReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user attended the event
    const attendee = event.attendees.find(
      a => a.user.toString() === req.user._id.toString() && a.status === 'attended'
    );

    if (!attendee) {
      return res.status(400).json({
        success: false,
        message: 'You can only review events you have attended'
      });
    }

    await event.addReview(req.user._id, rating, comment);

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add event review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
  getEventTypesAndCategories,
  registerForEvent,
  cancelEventRegistration,
  addEventReview
};
