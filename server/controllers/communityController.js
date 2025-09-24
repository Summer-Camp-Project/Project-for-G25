const ForumTopic = require('../models/Forum');
const StudyGroup = require('../models/StudyGroup');
const UserGoal = require('../models/UserGoal');
const { validationResult } = require('express-validator');

class CommunityController {
  // Forum Topics
  async getForumTopics(req, res) {
    try {
      const {
        category,
        search,
        page = 1,
        limit = 20,
        sort = 'lastActivity'
      } = req.query;

      const query = {};
      
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' }},
          { description: { $regex: search, $options: 'i' }}
        ];
      }

      const topics = await ForumTopic.find(query)
        .populate('author', 'name profileImage')
        .populate('lastPost.author', 'name profileImage')
        .sort({ isPinned: -1, [sort]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await ForumTopic.countDocuments(query);

      // Get category statistics
      const categoryStats = await ForumTopic.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      res.json({
        success: true,
        data: topics,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        },
        categories: categoryStats
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createForumTopic(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const {
        title,
        description,
        category = 'general',
        tags = [],
        relatedResource
      } = req.body;

      const topic = new ForumTopic({
        title,
        description,
        category,
        author: req.user.id,
        tags,
        relatedResource,
        posts: []
      });

      await topic.save();

      const populatedTopic = await ForumTopic.findById(topic._id)
        .populate('author', 'name profileImage');

      res.status(201).json({
        success: true,
        data: populatedTopic,
        message: 'Forum topic created successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getForumTopic(req, res) {
    try {
      const topic = await ForumTopic.findById(req.params.id)
        .populate('author', 'name profileImage bio')
        .populate('posts.author', 'name profileImage')
        .populate('posts.likes.user', 'name profileImage');

      if (!topic) {
        return res.status(404).json({ success: false, message: 'Topic not found' });
      }

      // Increment views
      await topic.incrementViews();

      res.json({
        success: true,
        data: topic
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addForumPost(req, res) {
    try {
      const { content, attachments = [] } = req.body;
      const topicId = req.params.id;

      const topic = await ForumTopic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Topic not found' });
      }

      if (topic.isLocked) {
        return res.status(403).json({ success: false, message: 'Topic is locked' });
      }

      await topic.addPost(req.user.id, content, attachments);

      const updatedTopic = await ForumTopic.findById(topicId)
        .populate('posts.author', 'name profileImage')
        .select('posts');

      const newPost = updatedTopic.posts[updatedTopic.posts.length - 1];

      res.status(201).json({
        success: true,
        data: newPost,
        message: 'Post added successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async likeForumPost(req, res) {
    try {
      const { topicId, postId } = req.params;
      const userId = req.user.id;

      const topic = await ForumTopic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Topic not found' });
      }

      const post = topic.posts.id(postId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }

      const existingLike = post.likes.find(like => 
        like.user.toString() === userId.toString()
      );

      if (existingLike) {
        // Remove like
        post.likes = post.likes.filter(like => 
          like.user.toString() !== userId.toString()
        );
      } else {
        // Add like
        post.likes.push({ user: userId });
      }

      await topic.save();

      res.json({
        success: true,
        data: {
          liked: !existingLike,
          likeCount: post.likes.length
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async subscribeToTopic(req, res) {
    try {
      const topicId = req.params.id;
      const userId = req.user.id;

      const topic = await ForumTopic.findById(topicId);
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Topic not found' });
      }

      await topic.subscribe(userId);

      res.json({
        success: true,
        message: 'Subscribed to topic'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Study Groups
  async getStudyGroups(req, res) {
    try {
      const {
        category,
        search,
        page = 1,
        limit = 20,
        sort = 'lastActivity'
      } = req.query;

      const query = { 
        status: 'active',
        $or: [
          { isPrivate: false },
          { 'members.user': req.user.id, 'members.isActive': true }
        ]
      };
      
      if (category) query.category = category;
      if (search) {
        query.$and = query.$and || [];
        query.$and.push({
          $or: [
            { name: { $regex: search, $options: 'i' }},
            { description: { $regex: search, $options: 'i' }}
          ]
        });
      }

      const groups = await StudyGroup.find(query)
        .populate('creator', 'name profileImage')
        .populate('members.user', 'name profileImage')
        .populate('relatedCourse', 'title')
        .sort({ [sort]: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await StudyGroup.countDocuments(query);

      res.json({
        success: true,
        data: groups,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createStudyGroup(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const {
        name,
        description,
        category = 'heritage',
        tags = [],
        relatedCourse,
        maxMembers = 20,
        isPrivate = false,
        requiresApproval = false,
        settings = {}
      } = req.body;

      const group = new StudyGroup({
        name,
        description,
        creator: req.user.id,
        category,
        tags,
        relatedCourse,
        maxMembers,
        isPrivate,
        requiresApproval,
        settings: {
          allowInvites: settings.allowInvites !== false,
          allowFileSharing: settings.allowFileSharing !== false,
          enableNotifications: settings.enableNotifications !== false
        },
        members: [{
          user: req.user.id,
          role: 'owner'
        }]
      });

      await group.save();

      if (isPrivate) {
        await group.generateInviteCode();
      }

      const populatedGroup = await StudyGroup.findById(group._id)
        .populate('creator', 'name profileImage')
        .populate('members.user', 'name profileImage')
        .populate('relatedCourse', 'title');

      res.status(201).json({
        success: true,
        data: populatedGroup,
        message: 'Study group created successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getStudyGroup(req, res) {
    try {
      const group = await StudyGroup.findById(req.params.id)
        .populate('creator', 'name profileImage bio')
        .populate('members.user', 'name profileImage')
        .populate('relatedCourse', 'title description')
        .populate('discussions.author', 'name profileImage')
        .populate('discussions.replies.author', 'name profileImage');

      if (!group) {
        return res.status(404).json({ success: false, message: 'Study group not found' });
      }

      // Check if user is a member
      const isMember = group.members.some(member => 
        member.user._id.toString() === req.user.id && member.isActive
      );

      if (group.isPrivate && !isMember) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      res.json({
        success: true,
        data: {
          ...group.toObject(),
          isMember,
          userRole: isMember ? 
            group.members.find(m => m.user._id.toString() === req.user.id).role : null
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async joinStudyGroup(req, res) {
    try {
      const groupId = req.params.id;
      const userId = req.user.id;
      const { inviteCode } = req.body;

      const group = await StudyGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Study group not found' });
      }

      if (group.isPrivate && group.inviteCode !== inviteCode) {
        return res.status(403).json({ success: false, message: 'Invalid invite code' });
      }

      await group.addMember(userId);

      res.json({
        success: true,
        message: 'Successfully joined study group'
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async leaveStudyGroup(req, res) {
    try {
      const groupId = req.params.id;
      const userId = req.user.id;

      const group = await StudyGroup.findById(groupId);
      if (!group) {
        return res.status(404).json({ success: false, message: 'Study group not found' });
      }

      await group.removeMember(userId);

      res.json({
        success: true,
        message: 'Left study group successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMyStudyGroups(req, res) {
    try {
      const { role, page = 1, limit = 10 } = req.query;

      const query = {
        'members.user': req.user.id,
        'members.isActive': true,
        status: 'active'
      };

      if (role) {
        query['members.role'] = role;
      }

      const groups = await StudyGroup.find(query)
        .populate('creator', 'name profileImage')
        .populate('members.user', 'name profileImage')
        .populate('relatedCourse', 'title')
        .sort({ lastActivity: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await StudyGroup.countDocuments(query);

      res.json({
        success: true,
        data: groups,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // User Goals (Social Goals)
  async getLeaderboard(req, res) {
    try {
      const { category, timeframe = 'monthly', limit = 50 } = req.query;

      let dateFilter = {};
      const now = new Date();
      
      switch (timeframe) {
        case 'weekly':
          dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
          break;
        case 'monthly':
          dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
          break;
        case 'yearly':
          dateFilter = { createdAt: { $gte: new Date(now.setFullYear(now.getFullYear() - 1)) } };
          break;
      }

      const matchQuery = {
        status: 'completed',
        isPublic: true,
        ...dateFilter
      };

      if (category) {
        matchQuery.category = category;
      }

      const leaderboard = await UserGoal.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$user',
            completedGoals: { $sum: 1 },
            totalProgress: { $sum: '$progress' },
            points: { $sum: { $multiply: ['$current', 10] } } // 10 points per unit
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            user: {
              id: '$user._id',
              name: '$user.name',
              profileImage: '$user.profileImage'
            },
            completedGoals: 1,
            totalProgress: 1,
            points: 1,
            score: { $add: ['$points', { $multiply: ['$completedGoals', 50] }] }
          }
        },
        { $sort: { score: -1 } },
        { $limit: limit * 1 }
      ]);

      res.json({
        success: true,
        data: leaderboard,
        timeframe,
        category: category || 'all'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async shareProgress(req, res) {
    try {
      const { goalId, message, platforms = ['internal'] } = req.body;

      const goal = await UserGoal.findOne({
        _id: goalId,
        user: req.user.id
      });

      if (!goal) {
        return res.status(404).json({ success: false, message: 'Goal not found' });
      }

      // Create a forum post about the achievement
      if (platforms.includes('internal') && goal.status === 'completed') {
        const topic = new ForumTopic({
          title: `🎉 Goal Achieved: ${goal.title}`,
          description: message || `I just completed my goal: ${goal.title}!`,
          category: 'announcements',
          author: req.user.id,
          tags: ['achievement', 'goal-completed'],
          posts: []
        });

        await topic.save();
      }

      res.json({
        success: true,
        message: 'Progress shared successfully'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Friend System (Basic)
  async findUsers(req, res) {
    try {
      const { search, page = 1, limit = 20 } = req.query;

      if (!search || search.length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search term must be at least 2 characters'
        });
      }

      const User = require('../models/User');
      
      const users = await User.find({
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          },
          { _id: { $ne: req.user.id } },
          { role: 'visitor' }
        ]
      })
      .select('name email profileImage bio createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

      const total = await User.countDocuments({
        $and: [
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          },
          { _id: { $ne: req.user.id } },
          { role: 'visitor' }
        ]
      });

      res.json({
        success: true,
        data: users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Community Statistics
  async getCommunityStats(req, res) {
    try {
      const [topicsCount, groupsCount, activeUsers] = await Promise.all([
        ForumTopic.countDocuments({}),
        StudyGroup.countDocuments({ status: 'active' }),
        StudyGroup.aggregate([
          { $unwind: '$members' },
          { $match: { 'members.isActive': true } },
          { $group: { _id: '$members.user' } },
          { $count: 'activeUsers' }
        ])
      ]);

      const activeUserCount = activeUsers[0]?.activeUsers || 0;

      res.json({
        success: true,
        data: {
          forumTopics: topicsCount,
          studyGroups: groupsCount,
          activeMembers: activeUserCount,
          totalInteractions: topicsCount + groupsCount
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CommunityController();
