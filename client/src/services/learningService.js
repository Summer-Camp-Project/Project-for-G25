import { api } from '../utils/api.js';

class LearningService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 10 * 60 * 1000; // 10 minutes
    this.progressKey = 'ethio_heritage_learning_progress';
  }

  /**
   * Get available learning courses
   * @returns {Promise<Array>} Learning courses
   */
  async getCourses() {
    const cacheKey = 'learning_courses';
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      const response = await api.request('/learning/courses');
      const courses = response.courses || response.data || response;
      
      this.cache.set(cacheKey, {
        data: courses,
        timestamp: Date.now()
      });
      
      return courses;
    } catch (error) {
      console.error('Get courses error:', error);
      // Return mock courses
      return this.getMockCourses();
    }
  }

  /**
   * Get course by ID
   * @param {string|number} courseId - Course ID
   * @returns {Promise<Object>} Course details
   */
  async getCourseById(courseId) {
    try {
      const response = await api.request(`/learning/courses/${courseId}`);
      return response.course || response.data || response;
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  }

  /**
   * Get lessons for a course
   * @param {string|number} courseId - Course ID
   * @returns {Promise<Array>} Course lessons
   */
  async getLessons(courseId) {
    try {
      const response = await api.request(`/learning/courses/${courseId}/lessons`);
      return response.lessons || response.data || response;
    } catch (error) {
      console.error('Get lessons error:', error);
      return [];
    }
  }

  /**
   * Get lesson by ID
   * @param {string|number} lessonId - Lesson ID
   * @returns {Promise<Object>} Lesson details
   */
  async getLessonById(lessonId) {
    try {
      const response = await api.request(`/learning/lessons/${lessonId}`);
      return response.lesson || response.data || response;
    } catch (error) {
      console.error('Get lesson by ID error:', error);
      throw error;
    }
  }

  /**
   * Start a lesson
   * @param {string|number} lessonId - Lesson ID
   * @returns {Promise<Object>} Lesson start result
   */
  async startLesson(lessonId) {
    try {
      const response = await api.request(`/learning/lessons/${lessonId}/start`, {
        method: 'POST'
      });
      
      // Update local progress
      this.updateLocalProgress(lessonId, 'started');
      
      return response;
    } catch (error) {
      console.error('Start lesson error:', error);
      this.updateLocalProgress(lessonId, 'started');
      return { success: true, message: 'Lesson started locally' };
    }
  }

  /**
   * Complete a lesson
   * @param {string|number} lessonId - Lesson ID
   * @param {Object} completionData - Completion data (score, time, etc.)
   * @returns {Promise<Object>} Lesson completion result
   */
  async completeLesson(lessonId, completionData = {}) {
    try {
      const response = await api.request(`/learning/lessons/${lessonId}/complete`, {
        method: 'POST',
        body: completionData
      });
      
      // Update local progress
      this.updateLocalProgress(lessonId, 'completed', completionData);
      
      return response;
    } catch (error) {
      console.error('Complete lesson error:', error);
      this.updateLocalProgress(lessonId, 'completed', completionData);
      return { success: true, message: 'Lesson completed locally' };
    }
  }

  /**
   * Get user's learning progress
   * @returns {Promise<Object>} Learning progress
   */
  async getLearningProgress() {
    try {
      const response = await api.request('/learning/progress');
      const serverProgress = response.progress || response.data || response;
      
      // Merge with local progress
      const localProgress = this.getLocalProgress();
      return this.mergeProgress(serverProgress, localProgress);
    } catch (error) {
      console.error('Get learning progress error:', error);
      return this.getLocalProgress() || this.getDefaultProgress();
    }
  }

  /**
   * Get learning achievements
   * @returns {Promise<Array>} Learning achievements
   */
  async getLearningAchievements() {
    try {
      const response = await api.request('/learning/achievements');
      return response.achievements || response.data || response;
    } catch (error) {
      console.error('Get learning achievements error:', error);
      return this.getMockAchievements();
    }
  }

  /**
   * Get learning resources
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Learning resources
   */
  async getResources(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.request(`/learning/resources${queryParams ? `?${queryParams}` : ''}`);
      return response.resources || response.data || response;
    } catch (error) {
      console.error('Get resources error:', error);
      return this.getMockResources();
    }
  }

  /**
   * Take a quiz/assessment
   * @param {string|number} quizId - Quiz ID
   * @param {Array} answers - User answers
   * @returns {Promise<Object>} Quiz results
   */
  async takeQuiz(quizId, answers) {
    try {
      const response = await api.request(`/learning/quizzes/${quizId}/submit`, {
        method: 'POST',
        body: { answers }
      });
      
      return response;
    } catch (error) {
      console.error('Take quiz error:', error);
      // Return mock quiz results
      return {
        score: Math.floor(Math.random() * 40) + 60, // 60-100%
        totalQuestions: answers.length,
        correctAnswers: Math.floor(answers.length * 0.8),
        passed: true,
        feedback: 'Great job! You have a good understanding of Ethiopian heritage.'
      };
    }
  }

  /**
   * Get learning leaderboard
   * @param {string} period - Time period (week, month, all)
   * @returns {Promise<Array>} Leaderboard data
   */
  async getLeaderboard(period = 'month') {
    try {
      const response = await api.request(`/learning/leaderboard?period=${period}`);
      return response.leaderboard || response.data || response;
    } catch (error) {
      console.error('Get leaderboard error:', error);
      return this.getMockLeaderboard();
    }
  }

  /**
   * Get learning recommendations
   * @returns {Promise<Array>} Recommended content
   */
  async getRecommendations() {
    try {
      const response = await api.request('/learning/recommendations');
      return response.recommendations || response.data || response;
    } catch (error) {
      console.error('Get recommendations error:', error);
      return this.getMockRecommendations();
    }
  }

  /**
   * Search learning content
   * @param {string} query - Search query
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Search results
   */
  async searchLearningContent(query, filters = {}) {
    try {
      const searchParams = {
        q: query,
        ...filters
      };
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await api.request(`/learning/search?${queryParams}`);
      return response.results || response.data || response;
    } catch (error) {
      console.error('Search learning content error:', error);
      return [];
    }
  }

  /**
   * Bookmark learning content
   * @param {string} contentType - Content type (lesson, course, resource)
   * @param {string|number} contentId - Content ID
   * @returns {Promise<Object>} Bookmark result
   */
  async bookmarkContent(contentType, contentId) {
    try {
      const response = await api.request('/learning/bookmarks', {
        method: 'POST',
        body: { contentType, contentId }
      });
      return response;
    } catch (error) {
      console.error('Bookmark content error:', error);
      this.updateLocalBookmarks(contentType, contentId, 'add');
      return { success: true, message: 'Bookmarked locally' };
    }
  }

  /**
   * Remove bookmark
   * @param {string|number} bookmarkId - Bookmark ID
   * @returns {Promise<Object>} Remove result
   */
  async removeBookmark(bookmarkId) {
    try {
      const response = await api.request(`/learning/bookmarks/${bookmarkId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Remove bookmark error:', error);
      return { success: true, message: 'Bookmark removed locally' };
    }
  }

  /**
   * Get user's bookmarks
   * @returns {Promise<Array>} User bookmarks
   */
  async getBookmarks() {
    try {
      const response = await api.request('/learning/bookmarks');
      return response.bookmarks || response.data || response;
    } catch (error) {
      console.error('Get bookmarks error:', error);
      return this.getLocalBookmarks();
    }
  }

  // Local progress management

  /**
   * Update local progress
   * @param {string|number} lessonId - Lesson ID
   * @param {string} status - Progress status
   * @param {Object} data - Additional data
   */
  updateLocalProgress(lessonId, status, data = {}) {
    try {
      const progress = this.getLocalProgress() || this.getDefaultProgress();
      
      if (!progress.lessons[lessonId]) {
        progress.lessons[lessonId] = {};
      }
      
      progress.lessons[lessonId].status = status;
      progress.lessons[lessonId].updatedAt = new Date().toISOString();
      
      if (data.score) {
        progress.lessons[lessonId].score = data.score;
      }
      
      if (status === 'completed') {
        progress.completedLessons++;
        progress.totalTimeSpent += data.timeSpent || 0;
      }
      
      // Update streak
      if (status === 'completed') {
        const today = new Date().toDateString();
        if (progress.lastActivityDate !== today) {
          const lastDate = new Date(progress.lastActivityDate);
          const todayDate = new Date(today);
          const diffTime = todayDate - lastDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            progress.currentStreak++;
          } else if (diffDays > 1) {
            progress.currentStreak = 1;
          }
          
          progress.lastActivityDate = today;
        }
      }
      
      this.saveLocalProgress(progress);
    } catch (error) {
      console.error('Update local progress error:', error);
    }
  }

  /**
   * Get local progress
   * @returns {Object|null} Local progress
   */
  getLocalProgress() {
    try {
      const stored = localStorage.getItem(this.progressKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Get local progress error:', error);
      return null;
    }
  }

  /**
   * Save local progress
   * @param {Object} progress - Progress data
   */
  saveLocalProgress(progress) {
    try {
      progress.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.progressKey, JSON.stringify(progress));
    } catch (error) {
      console.error('Save local progress error:', error);
    }
  }

  /**
   * Get default progress structure
   * @returns {Object} Default progress
   */
  getDefaultProgress() {
    return {
      totalLessons: 0,
      completedLessons: 0,
      currentStreak: 0,
      totalTimeSpent: 0,
      lastActivityDate: null,
      lessons: {},
      subjects: {},
      achievements: [],
      level: 1,
      points: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Merge server and local progress
   * @param {Object} serverProgress - Server progress
   * @param {Object} localProgress - Local progress
   * @returns {Object} Merged progress
   */
  mergeProgress(serverProgress, localProgress) {
    if (!serverProgress) return localProgress || this.getDefaultProgress();
    if (!localProgress) return serverProgress;
    
    // Use server data as base, overlay local changes
    const merged = { ...serverProgress };
    
    // Merge lesson progress
    Object.keys(localProgress.lessons || {}).forEach(lessonId => {
      const localLesson = localProgress.lessons[lessonId];
      const serverLesson = merged.lessons[lessonId];
      
      if (!serverLesson || new Date(localLesson.updatedAt) > new Date(serverLesson.updatedAt || 0)) {
        merged.lessons[lessonId] = localLesson;
      }
    });
    
    return merged;
  }

  // Mock data methods

  /**
   * Get mock courses
   * @returns {Array} Mock courses
   */
  getMockCourses() {
    return [
      {
        id: 1,
        title: 'Ethiopian History Fundamentals',
        description: 'Explore the rich history of Ethiopia from ancient times to modern day',
        image: 'https://picsum.photos/300/200?random=10',
        difficulty: 'Beginner',
        duration: '4 hours',
        lessons: 8,
        category: 'History',
        rating: 4.7,
        enrolled: 1250
      },
      {
        id: 2,
        title: 'Cultural Traditions of Ethiopia',
        description: 'Discover the diverse cultural practices and traditions across Ethiopian regions',
        image: 'https://picsum.photos/300/200?random=11',
        difficulty: 'Intermediate',
        duration: '3 hours',
        lessons: 6,
        category: 'Culture',
        rating: 4.8,
        enrolled: 890
      },
      {
        id: 3,
        title: 'Archaeological Wonders',
        description: 'Journey through Ethiopia\'s most significant archaeological discoveries',
        image: 'https://picsum.photos/300/200?random=12',
        difficulty: 'Advanced',
        duration: '5 hours',
        lessons: 10,
        category: 'Archaeology',
        rating: 4.9,
        enrolled: 650
      }
    ];
  }

  /**
   * Get mock achievements
   * @returns {Array} Mock achievements
   */
  getMockAchievements() {
    return [
      {
        id: 1,
        name: 'First Lesson',
        description: 'Completed your first learning lesson',
        icon: 'star',
        earnedAt: '2024-01-15T10:00:00Z',
        points: 10
      },
      {
        id: 2,
        name: 'History Explorer',
        description: 'Completed 5 history lessons',
        icon: 'book',
        earnedAt: '2024-01-20T14:30:00Z',
        points: 50
      },
      {
        id: 3,
        name: 'Quiz Master',
        description: 'Scored 90% or higher on 3 quizzes',
        icon: 'trophy',
        earnedAt: '2024-01-25T16:45:00Z',
        points: 75
      }
    ];
  }

  /**
   * Get mock resources
   * @returns {Array} Mock resources
   */
  getMockResources() {
    return [
      {
        id: 1,
        title: 'Ethiopian Timeline Interactive',
        type: 'Interactive Tool',
        description: 'Explore major events in Ethiopian history',
        url: '/resources/timeline',
        category: 'History',
        duration: '30 minutes'
      },
      {
        id: 2,
        title: 'Traditional Music Collection',
        type: 'Audio Library',
        description: 'Listen to traditional Ethiopian music',
        url: '/resources/music',
        category: 'Culture',
        duration: '2 hours'
      },
      {
        id: 3,
        title: 'Archaeological Site Maps',
        type: 'Reference Material',
        description: 'Detailed maps of Ethiopian archaeological sites',
        url: '/resources/maps',
        category: 'Archaeology',
        duration: '1 hour'
      }
    ];
  }

  /**
   * Get mock leaderboard
   * @returns {Array} Mock leaderboard
   */
  getMockLeaderboard() {
    return [
      { rank: 1, name: 'Ahmed K.', points: 1250, level: 5 },
      { rank: 2, name: 'Sara M.', points: 1180, level: 4 },
      { rank: 3, name: 'Dawit T.', points: 1050, level: 4 },
      { rank: 4, name: 'Meron A.', points: 920, level: 3 },
      { rank: 5, name: 'Yonas H.', points: 850, level: 3 }
    ];
  }

  /**
   * Get mock recommendations
   * @returns {Array} Mock recommendations
   */
  getMockRecommendations() {
    return [
      {
        id: 1,
        type: 'lesson',
        title: 'Queen of Sheba Legend',
        reason: 'Based on your interest in Ethiopian history',
        image: 'https://picsum.photos/200/150?random=20'
      },
      {
        id: 2,
        type: 'course',
        title: 'Ethiopian Orthodox Christianity',
        reason: 'Continue your religious artifacts exploration',
        image: 'https://picsum.photos/200/150?random=21'
      },
      {
        id: 3,
        type: 'quiz',
        title: 'Ancient Kingdoms Quiz',
        reason: 'Test your knowledge of Ethiopian kingdoms',
        image: 'https://picsum.photos/200/150?random=22'
      }
    ];
  }

  // Local bookmarks management

  /**
   * Update local bookmarks
   * @param {string} contentType - Content type
   * @param {string|number} contentId - Content ID
   * @param {string} action - Action (add/remove)
   */
  updateLocalBookmarks(contentType, contentId, action) {
    try {
      const bookmarks = this.getLocalBookmarks();
      const bookmarkKey = `${contentType}_${contentId}`;
      
      if (action === 'add') {
        bookmarks[bookmarkKey] = {
          contentType,
          contentId,
          addedAt: new Date().toISOString()
        };
      } else if (action === 'remove') {
        delete bookmarks[bookmarkKey];
      }
      
      localStorage.setItem('ethio_heritage_bookmarks', JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Update local bookmarks error:', error);
    }
  }

  /**
   * Get local bookmarks
   * @returns {Object} Local bookmarks
   */
  getLocalBookmarks() {
    try {
      const stored = localStorage.getItem('ethio_heritage_bookmarks');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Get local bookmarks error:', error);
      return {};
    }
  }
}

export default new LearningService();
