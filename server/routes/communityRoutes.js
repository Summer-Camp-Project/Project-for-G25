const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const communityController = require('../controllers/communityController');
const { auth: authenticate } = require('../middleware/auth');

// Middleware to ensure user is authenticated
router.use(authenticate);

// Forum routes
router.get('/forums/topics',
  [
    query('category').optional().isIn(['general', 'heritage-discussion', 'learning-help', 'museums', 'events', 'artifacts', 'culture', 'announcements']),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['lastActivity', 'createdAt', 'views', 'title'])
  ],
  communityController.getForumTopics
);

router.post('/forums/topics',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('category').optional().isIn(['general', 'heritage-discussion', 'learning-help', 'museums', 'events', 'artifacts', 'culture', 'announcements']),
    body('tags').optional().isArray(),
    body('relatedResource').optional().isObject()
  ],
  communityController.createForumTopic
);

router.get('/forums/topics/:id',
  [param('id').isMongoId()],
  communityController.getForumTopic
);

router.post('/forums/topics/:id/posts',
  [
    param('id').isMongoId(),
    body('content').notEmpty().withMessage('Content is required'),
    body('attachments').optional().isArray()
  ],
  communityController.addForumPost
);

router.post('/forums/topics/:topicId/posts/:postId/like',
  [
    param('topicId').isMongoId(),
    param('postId').isMongoId()
  ],
  communityController.likeForumPost
);

router.post('/forums/topics/:id/subscribe',
  [param('id').isMongoId()],
  communityController.subscribeToTopic
);

// Study Group routes
router.get('/study-groups',
  [
    query('category').optional().isIn(['heritage', 'history', 'culture', 'artifacts', 'language', 'general']),
    query('search').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['lastActivity', 'createdAt', 'memberCount', 'name'])
  ],
  communityController.getStudyGroups
);

router.post('/study-groups',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional().isString(),
    body('category').optional().isIn(['heritage', 'history', 'culture', 'artifacts', 'language', 'general']),
    body('tags').optional().isArray(),
    body('relatedCourse').optional().isMongoId(),
    body('maxMembers').optional().isInt({ min: 2, max: 100 }),
    body('isPrivate').optional().isBoolean(),
    body('requiresApproval').optional().isBoolean(),
    body('settings').optional().isObject()
  ],
  communityController.createStudyGroup
);

router.get('/study-groups/:id',
  [param('id').isMongoId()],
  communityController.getStudyGroup
);

router.post('/study-groups/:id/join',
  [
    param('id').isMongoId(),
    body('inviteCode').optional().isString()
  ],
  communityController.joinStudyGroup
);

router.post('/study-groups/:id/leave',
  [param('id').isMongoId()],
  communityController.leaveStudyGroup
);

router.get('/my-study-groups',
  [
    query('role').optional().isIn(['owner', 'moderator', 'member']),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  communityController.getMyStudyGroups
);

// Social features
router.get('/leaderboard',
  [
    query('category').optional().isIn(['course-completion', 'skill-building', 'knowledge', 'certification', 'exploration', 'social', 'habit', 'custom']),
    query('timeframe').optional().isIn(['weekly', 'monthly', 'yearly']),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  communityController.getLeaderboard
);

router.post('/share-progress',
  [
    body('goalId').isMongoId(),
    body('message').optional().isString(),
    body('platforms').optional().isArray()
  ],
  communityController.shareProgress
);

router.get('/find-friends',
  [
    query('search').notEmpty().withMessage('Search term is required'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
  ],
  communityController.findUsers
);

// Community statistics
router.get('/stats',
  communityController.getCommunityStats
);

module.exports = router;
