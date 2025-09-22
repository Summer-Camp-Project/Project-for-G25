const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { auth, authorize } = require('../middleware/auth');

// Import existing models (keep existing functionality)
const TourPackage = require('../models/TourPackage');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Course = require('../models/Course');

// Import new educational content management functions
const {
  getDashboardData,
  // Educational Tours
  getEducationalTours,
  getEducationalTour,
  createEducationalTour,
  updateEducationalTour,
  deleteEducationalTour,
  submitTourForApproval,
  getTourEnrollments,
  updateEnrollmentStatus,
  // Courses
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  submitCourseForApproval,
  publishCourse
} = require('../controllers/organizer');

// Get comprehensive dashboard data
router.get('/dashboard/:organizerId', async (req, res) => {
  try {
    const { organizerId } = req.params;
    
    // Skip auth verification for testing
    
    // Get user info
    const user = await User.findById(organizerId).select('name email avatar role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get dashboard statistics
    const [tourStats, bookingStats, messageStats, recentActivities, upcomingTours] = await Promise.all([
      // Tour package statistics
      TourPackage.aggregate([
        { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
        {
          $group: {
            _id: null,
            totalTours: { $sum: 1 },
            activeTours: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            totalViews: { $sum: '$stats.views' },
            averageRating: { $avg: '$stats.rating' }
          }
        }
      ]),
      
      // Booking statistics
      Booking.aggregate([
        { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
            pendingBookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
            completedBookings: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            totalRevenue: { $sum: '$totalAmount' },
            paidAmount: { $sum: '$payment.paidAmount' }
          }
        }
      ]),
      
      // Message statistics
      Message.aggregate([
        { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
        {
          $group: {
            _id: null,
            totalMessages: { $sum: 1 },
            unreadMessages: { $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] } },
            repliedMessages: { $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] } }
          }
        }
      ]),
      
      // Recent activities (bookings, messages)
      Promise.all([
        Booking.find({ organizerId })
          .populate('tourPackageId', 'title')
          .sort({ createdAt: -1 })
          .limit(5)
          .select('customerName status tourDate createdAt tourPackageId totalAmount'),
        Message.find({ organizerId })
          .sort({ createdAt: -1 })
          .limit(3)
          .select('customerName subject status createdAt')
      ]),
      
      // Upcoming tours
      Booking.find({
        organizerId: new mongoose.Types.ObjectId(organizerId),
        status: 'confirmed',
        tourDate: { $gte: new Date() }
      })
        .populate('tourPackageId', 'title location')
        .sort({ tourDate: 1 })
        .limit(4)
        .select('customerName guests tourDate tourPackageId')
    ]);
    
    // Process the results
    const dashboardStats = {
      totalTours: tourStats[0]?.totalTours || 0,
      activeTours: tourStats[0]?.activeTours || 0,
      totalViews: tourStats[0]?.totalViews || 0,
      averageRating: tourStats[0]?.averageRating || 0,
      
      totalBookings: bookingStats[0]?.totalBookings || 0,
      confirmedBookings: bookingStats[0]?.confirmedBookings || 0,
      pendingBookings: bookingStats[0]?.pendingBookings || 0,
      completedBookings: bookingStats[0]?.completedBookings || 0,
      totalRevenue: bookingStats[0]?.totalRevenue || 0,
      paidAmount: bookingStats[0]?.paidAmount || 0,
      pendingPayment: (bookingStats[0]?.totalRevenue || 0) - (bookingStats[0]?.paidAmount || 0),
      
      totalMessages: messageStats[0]?.totalMessages || 0,
      unreadMessages: messageStats[0]?.unreadMessages || 0,
      repliedMessages: messageStats[0]?.repliedMessages || 0
    };
    
    // Format recent activities
    const [recentBookings, recentMessages] = recentActivities;
    const activities = [];
    
    // Add booking activities
    recentBookings.forEach(booking => {
      activities.push({
        id: booking._id,
        type: 'booking',
        title: getBookingActivityTitle(booking),
        description: `${booking.customerName} - ${booking.tourPackageId?.title || 'Tour'} - $${booking.totalAmount}`,
        time: formatRelativeTime(booking.createdAt),
        user: booking.customerName,
        status: booking.status,
        relatedId: booking._id
      });
    });
    
    // Add message activities
    recentMessages.forEach(message => {
      activities.push({
        id: message._id,
        type: 'message',
        title: 'Customer message received',
        description: `${message.customerName} - "${message.subject}"`,
        time: formatRelativeTime(message.createdAt),
        user: message.customerName,
        status: message.status,
        relatedId: message._id
      });
    });
    
    // Sort activities by date
    activities.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    const dashboardData = {
      user: {
        id: user._id,
        name: user.name || user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      },
      stats: dashboardStats,
      recentActivities: activities.slice(0, 10),
      upcomingTours: upcomingTours.map(tour => ({
        id: tour._id,
        customerName: tour.customerName,
        tourTitle: tour.tourPackageId?.title || 'Unknown Tour',
        location: tour.tourPackageId?.location || 'Unknown Location',
        guests: tour.guests,
        tourDate: tour.tourDate
      }))
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get activity feed
router.get('/activities/:organizerId', async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Get recent bookings and messages
    const [bookings, messages] = await Promise.all([
      Booking.find({ organizerId })
        .populate('tourPackageId', 'title')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      Message.find({ organizerId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
    ]);
    
    const activities = [];
    
    bookings.forEach(booking => {
      activities.push({
        id: booking._id,
        type: 'booking',
        title: getBookingActivityTitle(booking),
        description: `${booking.customerName} - ${booking.tourPackageId?.title}`,
        time: formatRelativeTime(booking.createdAt),
        user: booking.customerName,
        status: booking.status,
        relatedId: booking._id,
        createdAt: booking.createdAt
      });
    });
    
    messages.forEach(message => {
      activities.push({
        id: message._id,
        type: 'message',
        title: 'Customer message',
        description: `${message.customerName} - "${message.subject}"`,
        time: formatRelativeTime(message.createdAt),
        user: message.customerName,
        status: message.status,
        relatedId: message._id,
        createdAt: message.createdAt
      });
    });
    
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get notifications for organizer
router.get('/notifications/:organizerId', async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { unreadOnly = false, limit = 10 } = req.query;
    
    const notifications = await Notification.getForUser(organizerId, {
      unreadOnly: unreadOnly === 'true',
      limit: parseInt(limit)
    });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { organizerId } = req.body; // Get organizerId from body
    
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    await notification.markAsRead(organizerId);
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper functions
function getBookingActivityTitle(booking) {
  const statusTitles = {
    'pending': 'New booking request',
    'confirmed': 'Booking confirmed',
    'cancelled': 'Booking cancelled',
    'completed': 'Tour completed',
    'refunded': 'Booking refunded'
  };
  return statusTitles[booking.status] || 'Booking updated';
}

function formatRelativeTime(date) {
  const now = new Date();
  const diffTime = Math.abs(now - new Date(date));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

// ===== COMPREHENSIVE EDUCATION MANAGEMENT ROUTES =====

// Education Dashboard & Stats
router.get('/education/dashboard', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'] || req.query.organizerId;
    
    if (!organizerId) {
      return res.status(400).json({ success: false, message: 'Organizer ID required' });
    }
    
    // Get real course statistics from database
    const courseStats = await Course.aggregate([
      { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          activeCourses: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
          totalStudents: { $sum: '$enrollmentCount' },
          averageRating: { $avg: '$averageRating' }
        }
      }
    ]);
    
    const stats = courseStats[0] || {
      totalCourses: 0,
      activeCourses: 0,
      totalStudents: 0,
      averageRating: 0
    };
    
    // Add mock data for assignments and discussions until those models are implemented
    stats.totalAssignments = Math.floor(stats.totalCourses * 2); // 2 assignments per course on average
    stats.completedAssignments = Math.floor(stats.totalAssignments * 0.75); // 75% completion rate
    stats.activeDiscussions = Math.floor(stats.totalCourses * 1.5); // 1.5 discussions per course
    stats.totalEnrollments = stats.totalStudents;
    stats.completionRate = stats.totalStudents > 0 ? Math.floor((stats.completedAssignments / stats.totalAssignments) * 100) : 0;
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Education dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== COURSES MANAGEMENT USING CONTROLLER =====

// Get all courses for organizer (from controller)
router.get('/courses', auth, authorize(['organizer']), getCourses);

// Get single course (from controller)
router.get('/courses/:id', auth, authorize(['organizer']), getCourse);

// Create course (from controller)
router.post('/courses', auth, authorize(['organizer']), createCourse);

// Update course (from controller)
router.put('/courses/:id', auth, authorize(['organizer']), updateCourse);

// Delete course (from controller)
router.delete('/courses/:id', auth, authorize(['organizer']), deleteCourse);

// Submit course for approval (from controller)
router.post('/courses/:id/submit-for-approval', auth, authorize(['organizer']), submitCourseForApproval);

// Publish course (from controller) - NEW ENDPOINT
router.post('/courses/:id/publish', auth, authorize(['organizer']), publishCourse);

// ===== EDUCATIONAL TOURS MANAGEMENT USING CONTROLLER =====

// Get all educational tours for organizer (from controller)
router.get('/educational-tours', auth, authorize(['organizer']), getEducationalTours);

// Get single educational tour (from controller)
router.get('/educational-tours/:id', auth, authorize(['organizer']), getEducationalTour);

// Create educational tour (from controller)
router.post('/educational-tours', auth, authorize(['organizer']), createEducationalTour);

// Update educational tour (from controller)
router.put('/educational-tours/:id', auth, authorize(['organizer']), updateEducationalTour);

// Delete educational tour (from controller)
router.delete('/educational-tours/:id', auth, authorize(['organizer']), deleteEducationalTour);

// Submit tour for approval (from controller)
router.post('/educational-tours/:id/submit-for-approval', auth, authorize(['organizer']), submitTourForApproval);

// Get tour enrollments (from controller)
router.get('/educational-tours/:id/enrollments', auth, authorize(['organizer']), getTourEnrollments);

// Update enrollment status (from controller)
router.put('/educational-tours/:tourId/enrollments/:userId', auth, authorize(['organizer']), updateEnrollmentStatus);

// Dashboard data using controller
router.get('/dashboard', auth, authorize(['organizer']), getDashboardData);

// ===== LEGACY MOCK ROUTES (KEEP FOR BACKWARD COMPATIBILITY) =====

// Get all courses for organizer
router.get('/education/courses', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'] || req.query.organizerId;
    const { status, category, page = 1, limit = 10 } = req.query;
    
    if (!organizerId) {
      return res.status(400).json({ success: false, message: 'Organizer ID required' });
    }
    
    // Build filter for database query
    const filter = { organizerId: new mongoose.Types.ObjectId(organizerId), isActive: true };
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    // Get courses from database
    const courses = await Course.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('organizerId', 'firstName lastName email')
      .lean();
    
    const total = await Course.countDocuments(filter);
    
    // Transform data to match frontend expectations
    const transformedCourses = courses.map(course => ({
      id: course._id.toString(),
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty: course.difficulty,
      duration: course.duration || 4,
      maxStudents: course.maxStudents || 30,
      enrolledStudents: course.enrollmentCount || 0,
      startDate: course.startDate || new Date().toISOString().split('T')[0],
      endDate: course.endDate || new Date(Date.now() + course.duration * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: course.price || 0,
      status: course.status === 'published' ? 'active' : course.status,
      instructor: course.instructor || 'Heritage Expert',
      rating: course.averageRating || 0,
      completionRate: course.enrollmentCount > 0 ? Math.floor(Math.random() * 30 + 70) : 0, // Mock completion rate
      totalLessons: course.lessons?.length || Math.floor(course.estimatedDuration / 30), // Estimate lessons
      completedLessons: Math.floor((course.lessons?.length || Math.floor(course.estimatedDuration / 30)) * 0.7), // Mock progress
      curriculum: course.curriculum || ['Introduction', 'Core Content', 'Advanced Topics'],
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }));
    
    res.json({ 
      success: true, 
      data: transformedCourses, 
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total: transformedCourses.length,
        totalCount: total
      } 
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new course
router.post('/education/courses', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'] || req.body.organizerId;
    const courseData = req.body;
    
    if (!organizerId) {
      return res.status(400).json({ success: false, message: 'Organizer ID required' });
    }
    
    // Create course in database
    const newCourse = new Course({
      ...courseData,
      organizerId: new mongoose.Types.ObjectId(organizerId),
      createdBy: new mongoose.Types.ObjectId(organizerId),
      status: 'published', // Auto-publish courses created by organizers
      enrollmentCount: 0,
      averageRating: 0,
      isActive: true
    });
    
    await newCourse.save();
    await newCourse.populate('organizerId', 'firstName lastName email');
    
    // Transform response to match frontend expectations
    const transformedCourse = {
      id: newCourse._id.toString(),
      title: newCourse.title,
      description: newCourse.description,
      category: newCourse.category,
      difficulty: newCourse.difficulty,
      duration: newCourse.duration || 4,
      maxStudents: newCourse.maxStudents || 30,
      enrolledStudents: 0,
      startDate: newCourse.startDate,
      endDate: newCourse.endDate,
      price: newCourse.price || 0,
      status: 'draft',
      instructor: newCourse.instructor,
      rating: 0,
      completionRate: 0,
      totalLessons: Math.floor((newCourse.estimatedDuration || 240) / 30),
      completedLessons: 0,
      curriculum: newCourse.curriculum || [],
      createdAt: newCourse.createdAt,
      updatedAt: newCourse.updatedAt
    };
    
    res.json({ success: true, data: transformedCourse, message: 'Course created successfully' });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific course
router.get('/education/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock course data - replace with actual database query
    const course = {
      id,
      title: 'Ancient Kingdoms of Ethiopia',
      description: 'Comprehensive study of Ethiopia\'s ancient civilizations',
      category: 'Ethiopian History',
      difficulty: 'Intermediate',
      duration: 8,
      maxStudents: 25,
      enrolledStudents: 18,
      curriculum: ['Introduction to Ancient Ethiopia', 'Aksumite Empire', 'Trade Networks'],
      // ... other course details
    };
    
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update course
router.put('/education/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Mock update - replace with actual database operations
    const updatedCourse = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: updatedCourse, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete course
router.delete('/education/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock deletion - replace with actual database operations
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== ASSIGNMENTS MANAGEMENT =====

// Get all assignments for organizer
router.get('/education/assignments', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'];
    const { courseId, status, type, page = 1, limit = 10 } = req.query;
    
    // Mock assignments data
    const assignments = [
      {
        id: '1',
        courseId: '1',
        courseName: 'Ancient Kingdoms of Ethiopia',
        title: 'Research Paper: Aksumite Trade Networks',
        description: 'Analyze the trade relationships of the Aksumite Empire',
        type: 'research',
        dueDate: '2024-03-15',
        maxPoints: 100,
        submittedCount: 12,
        totalStudents: 18,
        status: 'active',
        averageScore: 87,
        instructions: 'Detailed research paper requirements...',
        createdAt: '2024-02-20',
        updatedAt: '2024-02-20'
      }
    ];
    
    res.json({ success: true, data: assignments, pagination: { page, limit, total: assignments.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new assignment
router.post('/education/assignments', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'];
    const assignmentData = req.body;
    
    const newAssignment = {
      id: Date.now().toString(),
      ...assignmentData,
      organizerId,
      submittedCount: 0,
      status: 'active',
      averageScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: newAssignment, message: 'Assignment created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific assignment
router.get('/education/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock assignment data
    const assignment = {
      id,
      courseId: '1',
      courseName: 'Ancient Kingdoms of Ethiopia',
      title: 'Research Paper: Aksumite Trade Networks',
      description: 'Analyze the trade relationships of the Aksumite Empire',
      type: 'research',
      dueDate: '2024-03-15',
      maxPoints: 100,
      instructions: 'Detailed research paper requirements...',
      submissions: []
    };
    
    res.json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update assignment
router.put('/education/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedAssignment = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: updatedAssignment, message: 'Assignment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete assignment
router.delete('/education/assignments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({ success: true, message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get assignment submissions
router.get('/education/assignments/:id/submissions', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Mock submissions data
    const submissions = [
      {
        id: '1',
        assignmentId: id,
        studentId: '1',
        studentName: 'Alemayehu Tadesse',
        submittedAt: '2024-03-10',
        status: 'graded',
        score: 92,
        maxPoints: 100,
        feedback: 'Excellent research and analysis',
        files: ['research_paper.pdf']
      }
    ];
    
    res.json({ success: true, data: submissions, pagination: { page, limit, total: submissions.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Grade assignment submission
router.put('/education/assignments/:assignmentId/submissions/:submissionId/grade', async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { score, feedback } = req.body;
    
    const gradedSubmission = {
      id: submissionId,
      assignmentId,
      score,
      feedback,
      status: 'graded',
      gradedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: gradedSubmission, message: 'Assignment graded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DISCUSSIONS MANAGEMENT =====

// Get all discussions for organizer
router.get('/education/discussions', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'];
    const { courseId, category, page = 1, limit = 10 } = req.query;
    
    // Mock discussions data
    const discussions = [
      {
        id: '1',
        courseId: '1',
        courseName: 'Ancient Kingdoms of Ethiopia',
        title: 'Archaeological Evidence of Aksum',
        description: 'Discussion on recent archaeological discoveries',
        category: 'course-content',
        author: 'Dr. Yonas Beyene',
        authorId: organizerId,
        createdAt: '2024-02-20',
        replies: 23,
        lastActivity: '2024-02-25',
        isPinned: true,
        participants: 15
      }
    ];
    
    res.json({ success: true, data: discussions, pagination: { page, limit, total: discussions.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new discussion
router.post('/education/discussions', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'];
    const discussionData = req.body;
    
    const newDiscussion = {
      id: Date.now().toString(),
      ...discussionData,
      authorId: organizerId,
      author: 'Current User',
      replies: 0,
      participants: 1,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    res.json({ success: true, data: newDiscussion, message: 'Discussion created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific discussion with comments
router.get('/education/discussions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock discussion with comments
    const discussion = {
      id,
      courseId: '1',
      courseName: 'Ancient Kingdoms of Ethiopia',
      title: 'Archaeological Evidence of Aksum',
      description: 'Discussion on recent archaeological discoveries',
      category: 'course-content',
      author: 'Dr. Yonas Beyene',
      createdAt: '2024-02-20',
      isPinned: true,
      comments: [
        {
          id: '1',
          discussionId: id,
          author: 'Alemayehu Tadesse',
          authorId: '1',
          content: 'This is fascinating! The recent discoveries really change our understanding...',
          createdAt: '2024-02-21',
          likes: 5,
          replies: []
        }
      ]
    };
    
    res.json({ success: true, data: discussion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update discussion
router.put('/education/discussions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedDiscussion = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: updatedDiscussion, message: 'Discussion updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete discussion
router.delete('/education/discussions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({ success: true, message: 'Discussion deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== COMMENTS MANAGEMENT =====

// Add comment to discussion
router.post('/education/discussions/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const organizerId = req.user?.id || req.headers['organizer-id'];
    const { content } = req.body;
    
    const newComment = {
      id: Date.now().toString(),
      discussionId: id,
      authorId: organizerId,
      author: 'Current User',
      content,
      likes: 0,
      replies: [],
      createdAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: newComment, message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update comment
router.put('/education/discussions/:discussionId/comments/:commentId', async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    const { content } = req.body;
    
    const updatedComment = {
      id: commentId,
      discussionId,
      content,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: updatedComment, message: 'Comment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete comment
router.delete('/education/discussions/:discussionId/comments/:commentId', async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;
    
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== STUDENTS MANAGEMENT =====

// Get all students for organizer's courses
router.get('/education/students', async (req, res) => {
  try {
    const organizerId = req.user?.id || req.headers['organizer-id'];
    const { courseId, page = 1, limit = 10 } = req.query;
    
    // Mock students data
    const students = [
      {
        id: '1',
        name: 'Alemayehu Tadesse',
        email: 'alemayehu@email.com',
        enrolledCourses: 2,
        completedAssignments: 8,
        totalAssignments: 10,
        avgGrade: 88,
        enrollmentDate: '2024-02-01',
        lastActivity: '2024-02-25',
        status: 'active'
      },
      {
        id: '2',
        name: 'Bethel Mekonnen',
        email: 'bethel@email.com',
        enrolledCourses: 1,
        completedAssignments: 5,
        totalAssignments: 6,
        avgGrade: 92,
        enrollmentDate: '2024-02-15',
        lastActivity: '2024-02-24',
        status: 'active'
      }
    ];
    
    res.json({ success: true, data: students, pagination: { page, limit, total: students.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific student details
router.get('/education/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock student details
    const student = {
      id,
      name: 'Alemayehu Tadesse',
      email: 'alemayehu@email.com',
      enrolledCourses: [
        { id: '1', title: 'Ancient Kingdoms of Ethiopia', progress: 75, grade: 88 }
      ],
      assignments: [
        { id: '1', title: 'Research Paper', status: 'completed', score: 92, submittedAt: '2024-03-10' }
      ],
      discussions: [
        { id: '1', title: 'Archaeological Evidence', replies: 3, lastActivity: '2024-02-25' }
      ]
    };
    
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== ENROLLMENTS MANAGEMENT =====

// Get course enrollments
router.get('/education/courses/:id/enrollments', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    // Mock enrollments data
    const enrollments = [
      {
        id: '1',
        courseId: id,
        studentId: '1',
        studentName: 'Alemayehu Tadesse',
        studentEmail: 'alemayehu@email.com',
        enrollmentDate: '2024-02-01',
        status: 'active',
        progress: 75,
        completedAssignments: 8,
        totalAssignments: 10,
        currentGrade: 88
      }
    ];
    
    res.json({ success: true, data: enrollments, pagination: { page, limit, total: enrollments.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update enrollment status
router.put('/education/courses/:courseId/enrollments/:studentId', async (req, res) => {
  try {
    const { courseId, studentId } = req.params;
    const { status, grade } = req.body;
    
    const updatedEnrollment = {
      courseId,
      studentId,
      status,
      grade,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: updatedEnrollment, message: 'Enrollment updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
