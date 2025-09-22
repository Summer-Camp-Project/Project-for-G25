const express = require('express');
const router = express.Router();
const educationController = require('../controllers/education');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { courseId } = req.params;
    const uploadPath = path.join(__dirname, '../uploads/education', courseId || 'general');
    
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error, null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and documents for educational content
  const allowedTypes = [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'video/mp4',
    'audio/mpeg',
    'application/zip'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, documents, videos, and archives are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: fileFilter
});

// ===== COURSE ROUTES =====

// Get all courses for organizer
router.get('/courses', educationController.getCourses);

// Get specific course
router.get('/courses/:id', educationController.getCourse);

// Create new course
router.post('/courses', educationController.createCourse);

// Update course
router.put('/courses/:id', educationController.updateCourse);

// Delete course (soft delete)
router.delete('/courses/:id', educationController.deleteCourse);

// Public route to get limited course info (for homepage and course listing)
router.get('/public/courses', async (req, res) => {
  try {
    const { category, limit = 6, page = 1 } = req.query;
    
    const Course = require('../models/Course');
    const LearningProgress = require('../models/LearningProgress');
    
    const filter = { isActive: true, status: 'published' };
    if (category && category !== 'all') filter.category = category;
    
    const courses = await Course.find(filter)
      .sort({ createdAt: -1, enrollmentCount: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('organizerId', 'firstName lastName')
      .lean();
    
    const coursesWithStats = await Promise.all(courses.map(async (course) => {
      const enrollmentCount = await LearningProgress.countDocuments({
        'courses.courseId': course._id
      });
      
      const completionCount = await LearningProgress.countDocuments({
        'courses.courseId': course._id,
        'courses.status': 'completed'
      });

      return {
        id: course._id.toString(),
        title: course.title,
        description: course.description.length > 150 ? 
          course.description.substring(0, 150) + '...' : course.description,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration || 4,
        enrolledStudents: enrollmentCount,
        price: course.price || 0,
        instructor: course.instructor || 
          (course.organizerId ? `${course.organizerId.firstName} ${course.organizerId.lastName}` : 'Heritage Expert'),
        rating: course.averageRating || 0,
        totalLessons: course.lessons?.length || Math.floor((course.estimatedDuration || 240) / 30),
        image: course.imageUrl || '/images/course-placeholder.jpg',
        completionRate: enrollmentCount > 0 ? Math.round((completionCount / enrollmentCount) * 100) : 0
      };
    }));
    
    const total = await Course.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: coursesWithStats,
      pagination: { 
        page: parseInt(page), 
        limit: parseInt(limit), 
        total: coursesWithStats.length,
        totalCount: total
      }
    });
  } catch (error) {
    console.error('Get public courses error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== ASSIGNMENT ROUTES =====

// Get assignments
router.get('/assignments', educationController.getAssignments);

// Create assignment
router.post('/assignments', educationController.createAssignment);

// Upload assignment files
router.post('/assignments/:assignmentId/files', upload.array('files', 5), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const Assignment = require('../models/Assignment');
    const assignment = await Assignment.findById(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    
    const uploadedFiles = req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/education/${req.params.courseId || 'general'}/${file.filename}`,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date()
    }));
    
    // Add files to assignment
    assignment.attachments = assignment.attachments || [];
    assignment.attachments.push(...uploadedFiles);
    await assignment.save();
    
    res.json({ 
      success: true, 
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload assignment files error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DISCUSSION ROUTES =====

// Get discussions
router.get('/discussions', educationController.getDiscussions);

// Create discussion
router.post('/discussions', educationController.createDiscussion);

// ===== FEEDBACK ROUTES =====

// Get feedback
router.get('/feedback', educationController.getFeedback);

// Respond to feedback
router.post('/feedback/:id/respond', educationController.respondToFeedback);

// Submit feedback with file attachments
router.post('/courses/:courseId/feedback', upload.array('attachments', 3), educationController.submitFeedback);

// ===== STUDENT MANAGEMENT ROUTES =====

// Get students
router.get('/students', educationController.getStudents);

// ===== UPLOAD ROUTES =====

// Upload course materials
router.post('/courses/:courseId/upload', upload.array('materials', 10), async (req, res) => {
  try {
    const { courseId } = req.params;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const uploadedFiles = req.files.map(file => ({
      filename: file.originalname,
      url: `/uploads/education/${courseId}/${file.filename}`,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date()
    }));
    
    // Add files to course materials
    course.materials = course.materials || [];
    course.materials.push(...uploadedFiles);
    await course.save();
    
    res.json({ 
      success: true, 
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    console.error('Upload course materials error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get uploaded files for a course
router.get('/courses/:courseId/files', async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const Course = require('../models/Course');
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({ 
      success: true, 
      data: course.materials || []
    });
  } catch (error) {
    console.error('Get course files error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== ENROLLMENT ROUTES =====

// Enroll in course
router.post('/courses/:courseId/enroll', async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }
    
    const Course = require('../models/Course');
    const LearningProgress = require('../models/LearningProgress');
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    // Check if already enrolled
    const existingProgress = await LearningProgress.findOne({
      userId: userId,
      'courses.courseId': courseId
    });
    
    if (existingProgress) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }
    
    // Create or update learning progress
    let progress = await LearningProgress.findOne({ userId: userId });
    
    if (!progress) {
      progress = new LearningProgress({
        userId: userId,
        courses: []
      });
    }
    
    progress.courses.push({
      courseId: courseId,
      enrolledAt: new Date(),
      progressPercentage: 0,
      status: 'enrolled',
      lessons: []
    });
    
    await progress.save();
    
    // Update course enrollment count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    
    res.json({ success: true, message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enroll in course error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get enrollment status
router.get('/courses/:courseId/enrollment/:userId', async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    
    const LearningProgress = require('../models/LearningProgress');
    
    const progress = await LearningProgress.findOne({
      userId: userId,
      'courses.courseId': courseId
    });
    
    const isEnrolled = !!progress;
    const courseProgress = progress?.courses.find(c => c.courseId.toString() === courseId);
    
    res.json({ 
      success: true, 
      data: {
        isEnrolled,
        progressPercentage: courseProgress?.progressPercentage || 0,
        status: courseProgress?.status || 'not_enrolled',
        enrolledAt: courseProgress?.enrolledAt,
        completedLessons: courseProgress?.lessons.filter(l => l.status === 'completed').length || 0
      }
    });
  } catch (error) {
    console.error('Get enrollment status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
