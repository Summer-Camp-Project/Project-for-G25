const express = require('express');
const router = express.Router();
const educationController = require('../controllers/education');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { courseId, assignmentId, discussionId } = req.params;
    const owner = courseId || assignmentId || discussionId || 'general';
    let uploadPath;
    
    if (file.fieldname === 'courseImage' || file.fieldname === 'courseThumbnail') {
      uploadPath = path.join(__dirname, '../uploads/courses', 'images');
    } else if (file.fieldname === 'lessonImage' || file.fieldname === 'lessonVideo' || file.fieldname === 'lessonAudio') {
      uploadPath = path.join(__dirname, '../uploads/lessons', file.fieldname.replace('lesson', '').toLowerCase());
    } else {
      uploadPath = path.join(__dirname, '../uploads/education', owner);
    }
    
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
  // Allow common file types for education
  const allowedTypes = [
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/wav', 'audio/mp3'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }
  cb(new Error(`Unsupported file type: ${file.mimetype}`));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 50 * 1024 * 1024, // 50MB for education files
    files: 10 // Max 10 files per upload
  }
});

// ===== ASSIGNMENT SUBMISSIONS (Student) =====

// Submit an assignment with optional files/links/text
router.post('/assignments/:assignmentId/submit', upload.array('files', 10), async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const studentId = req.user?.id || req.body.studentId;
    const { text, links = [] } = req.body;

    if (!studentId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const Assignment = require('../models/Assignment');
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    // Check if submission allowed
    if (!assignment.isSubmissionAllowed(studentId)) {
      return res.status(400).json({ success: false, message: 'Submission not allowed (limit reached or past due date)' });
    }

    // Prepare files
    const files = (req.files || []).map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/education/${assignmentId}/${file.filename}`
    }));

    // Create submission
    const submission = {
      studentId,
      content: { text: text || '', links: Array.isArray(links) ? links : [links], files },
      submittedAt: new Date(),
      status: 'submitted'
    };

    assignment.submissions.push(submission);
    await assignment.calculateStats();

    res.status(201).json({ success: true, message: 'Submission created', submission: assignment.submissions[assignment.submissions.length - 1] });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// List submissions for an assignment (organizer/instructor)
router.get('/assignments/:assignmentId/submissions', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const Assignment = require('../models/Assignment');
    const assignment = await Assignment.findById(assignmentId).populate('submissions.studentId', 'firstName lastName email');
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    res.json({ success: true, submissions: assignment.submissions });
  } catch (error) {
    console.error('List submissions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Grade a submission (organizer/instructor)
router.put('/assignments/:assignmentId/submissions/:submissionId/grade', async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { score, feedback, rubricScores = [] } = req.body;
    const graderId = req.user?.id;

    const Assignment = require('../models/Assignment');
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const sub = assignment.submissions.id(submissionId);
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });

    sub.grade = { score, feedback, rubricScores, gradedBy: graderId, gradedAt: new Date() };
    sub.status = 'graded';
    await assignment.calculateStats();

    res.json({ success: true, message: 'Submission graded', submission: sub });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a submission (admin/instructor)
router.delete('/assignments/:assignmentId/submissions/:submissionId', async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const Assignment = require('../models/Assignment');
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    const sub = assignment.submissions.id(submissionId);
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });
    sub.deleteOne();
    await assignment.calculateStats();
    res.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    console.error('Delete submission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===== DISCUSSION POSTS & REPLIES =====

// Add a post to discussion (with attachments)
router.post('/discussions/:discussionId/posts', upload.array('files', 10), async (req, res) => {
  try {
    const { discussionId } = req.params;
    const authorId = req.user?.id || req.body.authorId;
    const { content } = req.body;
    if (!authorId) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    const Discussion = require('../models/Discussion');
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });

    const attachments = (req.files || []).map(file => ({
      filename: file.originalname,
      url: `/uploads/education/${discussionId}/${file.filename}`,
      type: file.mimetype
    }));

    discussion.posts.push({ author: authorId, content, attachments });
    discussion.stats.totalPosts = (discussion.stats.totalPosts || 0) + 1;
    discussion.stats.lastActivity = new Date();
    await discussion.save();

    res.status(201).json({ success: true, message: 'Post added', post: discussion.posts[discussion.posts.length - 1] });
  } catch (error) {
    console.error('Add post error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reply to a post
router.post('/discussions/:discussionId/posts/:postId/replies', async (req, res) => {
  try {
    const { discussionId, postId } = req.params;
    const authorId = req.user?.id || req.body.authorId;
    const { content } = req.body;
    if (!authorId) return res.status(401).json({ success: false, message: 'Authentication required' });
    if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

    const Discussion = require('../models/Discussion');
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });

    const post = discussion.posts.id(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.replies.push({ author: authorId, content, createdAt: new Date() });
    discussion.stats.lastActivity = new Date();
    await discussion.save();

    res.status(201).json({ success: true, message: 'Reply added', post });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Like/Unlike a post
router.post('/discussions/:discussionId/posts/:postId/like', async (req, res) => {
  try {
    const { discussionId, postId } = req.params;
    const userId = req.user?.id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const Discussion = require('../models/Discussion');
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) return res.status(404).json({ success: false, message: 'Discussion not found' });

    const post = discussion.posts.id(postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const existing = (post.likes || []).find(l => l.user.toString() === userId.toString());
    if (existing) {
      post.likes = post.likes.filter(l => l.user.toString() !== userId.toString());
    } else {
      post.likes.push({ user: userId, likedAt: new Date() });
    }
    await discussion.save();

    res.json({ success: true, message: 'Like state toggled', likes: post.likes.length });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ===== COURSE ROUTES =====

// Get all courses for organizer
router.get('/courses', educationController.getCourses);

// Get specific course
router.get('/courses/:id', educationController.getCourse);

// Create new course with image upload
router.post('/courses', upload.fields([{ name: 'courseImage', maxCount: 1 }, { name: 'courseThumbnail', maxCount: 1 }]), educationController.createCourse);

// Update course with image upload
router.put('/courses/:id', upload.fields([{ name: 'courseImage', maxCount: 1 }, { name: 'courseThumbnail', maxCount: 1 }]), educationController.updateCourse);

// Upload course image separately
router.post('/courses/:id/image', upload.single('courseImage'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }
    
    const Course = require('../models/Course');
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const imageUrl = `/uploads/courses/images/${req.file.filename}`;
    course.image = imageUrl;
    course.imageUrl = imageUrl;
    await course.save();
    
    res.json({ 
      success: true, 
      message: 'Course image uploaded successfully',
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload course image error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload course thumbnail separately
router.post('/courses/:id/thumbnail', upload.single('courseThumbnail'), async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No thumbnail file provided' });
    }
    
    const Course = require('../models/Course');
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    const thumbnailUrl = `/uploads/courses/images/${req.file.filename}`;
    course.thumbnail = thumbnailUrl;
    course.thumbnailUrl = thumbnailUrl;
    await course.save();
    
    res.json({ 
      success: true, 
      message: 'Course thumbnail uploaded successfully',
      thumbnailUrl: thumbnailUrl
    });
  } catch (error) {
    console.error('Upload course thumbnail error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

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

    // Prioritize super admin courses first, then sort by enrollment count and creation date
    const courses = await Course.find(filter)
      .sort({ isSuperAdminCourse: -1, enrollmentCount: -1, createdAt: -1 })
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
        completionRate: enrollmentCount > 0 ? Math.round((completionCount / enrollmentCount) * 100) : 0,
        isSuperAdminCourse: course.isSuperAdminCourse || false
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
      url: `/uploads/education/${req.params.courseId || req.params.assignmentId || 'general'}/${file.filename}`,
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
