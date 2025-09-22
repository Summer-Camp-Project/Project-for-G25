// Organizer Controller with Educational Content Management
// Handles organizer-specific functionality including educational tours and courses

const EducationalTour = require('../models/EducationalTour');
const Course = require('../models/Course');
const User = require('../models/User');
const Event = require('../models/Event');
const LearningProgress = require('../models/LearningProgress');
const { asyncHandler } = require('../middleware/asyncHandler');

// ======= DASHBOARD & STATISTICS =======

// Get organizer dashboard data with educational content statistics
exports.getDashboardData = asyncHandler(async (req, res) => {
  const organizerId = req.user._id;
  
  // Get organizer info
  const organizer = await User.findById(organizerId).select('-password');
  if (!organizer || organizer.role !== 'organizer') {
    return res.status(404).json({
      success: false,
      message: 'Organizer not found'
    });
  }

  // Get educational tours statistics
  const toursStats = await EducationalTour.aggregate([
    { $match: { organizerId: organizerId } },
    {
      $group: {
        _id: null,
        totalTours: { $sum: 1 },
        publishedTours: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        pendingTours: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        draftTours: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
        totalEnrollments: { $sum: '$stats.enrollments' },
        totalCompletions: { $sum: '$stats.completions' },
        averageRating: { $avg: '$stats.averageRating' },
        totalRevenue: { $sum: { $multiply: ['$pricing.price', '$stats.enrollments'] } }
      }
    }
  ]);

  // Get courses statistics
  const coursesStats = await Course.aggregate([
    { $match: { organizerId: organizerId } },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        publishedCourses: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
        pendingCourses: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        draftCourses: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
        totalEnrollments: { $sum: '$enrollmentCount' },
        averageRating: { $avg: '$averageRating' }
      }
    }
  ]);

  // Get recent activity
  const recentTours = await EducationalTour.find({ organizerId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status startDate enrollments stats');

  const recentCourses = await Course.find({ organizerId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title status enrollmentCount averageRating');

  const stats = {
    tours: toursStats[0] || {
      totalTours: 0,
      publishedTours: 0,
      pendingTours: 0,
      draftTours: 0,
      totalEnrollments: 0,
      totalCompletions: 0,
      averageRating: 0,
      totalRevenue: 0
    },
    courses: coursesStats[0] || {
      totalCourses: 0,
      publishedCourses: 0,
      pendingCourses: 0,
      draftCourses: 0,
      totalEnrollments: 0,
      averageRating: 0
    }
  };

  res.json({
    success: true,
    data: {
      organizer: {
        id: organizer._id,
        name: `${organizer.firstName} ${organizer.lastName}`,
        email: organizer.email,
        permissions: organizer.permissions,
        createdAt: organizer.createdAt
      },
      stats,
      recentActivity: {
        tours: recentTours,
        courses: recentCourses
      }
    }
  });
});

// Get organizer events
exports.getEvents = async (req, res) => {
  try {
    const organizerId = req.user?._id || req.params.organizerId;
    
    const events = await Event.find({ organizerId })
      .sort({ createdAt: -1 })
      .populate('organizerId', 'firstName lastName email');
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching organizer events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const organizerId = req.user?._id || req.params.organizerId;
    const eventData = {
      ...req.body,
      organizerId,
      createdBy: organizerId,
      status: 'pending'
    };
    
    const newEvent = await Event.create(eventData);
    await newEvent.populate('organizerId', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: newEvent,
      message: 'Event created successfully'
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const organizerId = req.user?._id;
    const updateData = {
      ...req.body,
      updatedBy: organizerId,
      updatedAt: new Date()
    };
    
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, organizerId },
      updateData,
      { new: true, runValidators: true }
    ).populate('organizerId', 'firstName lastName email');
    
    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unauthorized'
      });
    }

    res.json({
      success: true,
      data: updatedEvent,
      message: 'Event updated successfully'
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// ======= EDUCATIONAL TOURS MANAGEMENT =======

// Get all educational tours for organizer
exports.getEducationalTours = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const organizerId = req.user._id;

  // Build filter
  const filter = { organizerId };
  if (status) filter.status = status;

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const tours = await EducationalTour.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('organizerId', 'firstName lastName email')
    .populate('enrollments.userId', 'firstName lastName email');

  const total = await EducationalTour.countDocuments(filter);

  res.json({
    success: true,
    data: {
      tours,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: tours.length,
        totalCount: total
      }
    }
  });
});

// Get single educational tour
exports.getEducationalTour = asyncHandler(async (req, res) => {
  const tour = await EducationalTour.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  }).populate('organizerId', 'firstName lastName email')
    .populate('enrollments.userId', 'firstName lastName email');

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Educational tour not found'
    });
  }

  res.json({
    success: true,
    data: tour
  });
});

// Create educational tour
exports.createEducationalTour = asyncHandler(async (req, res) => {
  const tourData = {
    ...req.body,
    organizerId: req.user._id,
    organizerName: `${req.user.firstName} ${req.user.lastName}`,
    createdBy: req.user._id,
    status: 'draft' // Default to draft status for approval workflow
  };

  // Validate curriculum structure if provided
  if (tourData.curriculum && tourData.curriculum.length > 0) {
    tourData.curriculum = tourData.curriculum.map((lesson, index) => ({
      ...lesson,
      order: lesson.order || index + 1
    }));
  }

  const tour = await EducationalTour.create(tourData);
  await tour.populate('organizerId', 'firstName lastName email');

  res.status(201).json({
    success: true,
    data: tour,
    message: 'Educational tour created successfully'
  });
});

// Update educational tour
exports.updateEducationalTour = asyncHandler(async (req, res) => {
  const tour = await EducationalTour.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Educational tour not found'
    });
  }

  // Don't allow updates to published tours with enrollments
  if (tour.status === 'published' && tour.enrollments.length > 0) {
    const restrictedFields = ['startDate', 'endDate', 'maxParticipants', 'pricing'];
    const hasRestrictedChanges = restrictedFields.some(field => 
      req.body[field] !== undefined
    );
    
    if (hasRestrictedChanges) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify critical tour details after enrollment has begun'
      });
    }
  }

  // Update curriculum order if provided
  if (req.body.curriculum && req.body.curriculum.length > 0) {
    req.body.curriculum = req.body.curriculum.map((lesson, index) => ({
      ...lesson,
      order: lesson.order || index + 1
    }));
  }

  const updatedTour = await EducationalTour.findByIdAndUpdate(
    req.params.id,
    { 
      ...req.body,
      updatedBy: req.user._id
    },
    { new: true, runValidators: true }
  ).populate('organizerId', 'firstName lastName email');

  res.json({
    success: true,
    data: updatedTour,
    message: 'Educational tour updated successfully'
  });
});

// Delete educational tour
exports.deleteEducationalTour = asyncHandler(async (req, res) => {
  const tour = await EducationalTour.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Educational tour not found'
    });
  }

  // Don't allow deletion of published tours with enrollments
  if (tour.status === 'published' && tour.enrollments.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete published tour with active enrollments'
    });
  }

  await EducationalTour.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Educational tour deleted successfully'
  });
});

// Submit tour for approval
exports.submitTourForApproval = asyncHandler(async (req, res) => {
  const tour = await EducationalTour.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Educational tour not found'
    });
  }

  if (tour.status !== 'draft') {
    return res.status(400).json({
      success: false,
      message: 'Only draft tours can be submitted for approval'
    });
  }

  tour.status = 'pending';
  tour.submittedAt = new Date();
  await tour.save();

  res.json({
    success: true,
    data: tour,
    message: 'Tour submitted for approval'
  });
});

// Get tour enrollments
exports.getTourEnrollments = asyncHandler(async (req, res) => {
  const tour = await EducationalTour.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  }).populate({
    path: 'enrollments.userId',
    select: 'firstName lastName email profileImage'
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Educational tour not found'
    });
  }

  res.json({
    success: true,
    data: {
      tourTitle: tour.title,
      enrollments: tour.enrollments,
      stats: {
        total: tour.enrollments.length,
        confirmed: tour.enrollments.filter(e => e.status === 'confirmed').length,
        pending: tour.enrollments.filter(e => e.status === 'pending').length,
        completed: tour.enrollments.filter(e => e.status === 'completed').length
      }
    }
  });
});

// Update enrollment status
exports.updateEnrollmentStatus = asyncHandler(async (req, res) => {
  const { tourId, userId } = req.params;
  const { status, notes } = req.body;

  const tour = await EducationalTour.findOne({
    _id: tourId,
    organizerId: req.user._id
  });

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Educational tour not found'
    });
  }

  const enrollment = tour.enrollments.find(e => e.userId.toString() === userId);
  if (!enrollment) {
    return res.status(404).json({
      success: false,
      message: 'Enrollment not found'
    });
  }

  enrollment.status = status;
  if (notes) enrollment.notes = notes;
  enrollment.updatedAt = new Date();

  await tour.save();

  res.json({
    success: true,
    message: 'Enrollment status updated successfully'
  });
});

// ======= COURSES MANAGEMENT =======

// Get all courses for organizer
exports.getCourses = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const organizerId = req.user._id;

  // Build filter
  const filter = { organizerId };
  if (status) filter.status = status;

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const courses = await Course.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('organizerId', 'firstName lastName email');

  const total = await Course.countDocuments(filter);

  res.json({
    success: true,
    data: {
      courses,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: courses.length,
        totalCount: total
      }
    }
  });
});

// Get single course
exports.getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  }).populate('organizerId', 'firstName lastName email')
    .populate('lessons');

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  res.json({
    success: true,
    data: course
  });
});

// Create course
exports.createCourse = asyncHandler(async (req, res) => {
  const courseData = {
    ...req.body,
    organizerId: req.user._id,
    createdBy: req.user._id,
    status: 'draft' // Default to draft status for approval workflow
  };

  const course = await Course.create(courseData);
  await course.populate('organizerId', 'firstName lastName email');

  res.status(201).json({
    success: true,
    data: course,
    message: 'Course created successfully'
  });
});

// Update course
exports.updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { 
      ...req.body,
      updatedBy: req.user._id
    },
    { new: true, runValidators: true }
  ).populate('organizerId', 'firstName lastName email');

  res.json({
    success: true,
    data: updatedCourse,
    message: 'Course updated successfully'
  });
});

// Delete course
exports.deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Don't allow deletion of published courses with enrollments
  if (course.status === 'published' && course.enrollmentCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete published course with active enrollments'
    });
  }

  await Course.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Course deleted successfully'
  });
});

// Submit course for approval
exports.submitCourseForApproval = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (course.status !== 'draft') {
    return res.status(400).json({
      success: false,
      message: 'Only draft courses can be submitted for approval'
    });
  }

  course.status = 'pending';
  course.submittedAt = new Date();
  await course.save();

  res.json({
    success: true,
    data: course,
    message: 'Course submitted for approval'
  });
});

// Publish course (make it publicly available)
exports.publishCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOne({
    _id: req.params.id,
    organizerId: req.user._id
  });

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Allow publishing from draft or pending status
  if (!['draft', 'pending'].includes(course.status)) {
    return res.status(400).json({
      success: false,
      message: 'Course must be in draft or pending status to publish'
    });
  }

  course.status = 'published';
  course.publishedAt = new Date();
  await course.save();

  res.json({
    success: true,
    data: course,
    message: 'Course published successfully and is now visible to students'
  });
});
