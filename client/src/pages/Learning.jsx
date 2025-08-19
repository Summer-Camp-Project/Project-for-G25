import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Play, 
  ArrowRight, 
  Trophy,
  TrendingUp,
  Target,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import learningService from '../services/learningService';

const Learning = () => {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = async () => {
    try {
      const [coursesData, progressData, achievementsData, recommendationsData] = await Promise.all([
        learningService.getCourses(),
        learningService.getLearningProgress(),
        learningService.getLearningAchievements(),
        learningService.getRecommendations()
      ]);

      // Add Muslim heritage courses to the default courses
      const muslimHeritageCourses = [
        {
          id: 'muslim-1',
          title: 'Islamic History of Ethiopia',
          description: 'Explore the rich Islamic heritage of Ethiopia from the arrival of Islam in the 7th century to the modern era.',
          category: 'Islamic Heritage',
          difficulty: 'Intermediate',
          duration: '6 weeks',
          lessons: 24,
          rating: 4.8,
          enrolled: 1250,
          image: 'https://picsum.photos/400/200?random=islamic1'
        },
        {
          id: 'muslim-2',
          title: 'Harar: The Fourth Holy City of Islam',
          description: 'Discover the sacred city of Harar, its 99 mosques, Islamic architecture, and role in Islamic scholarship.',
          category: 'Islamic Architecture',
          difficulty: 'Beginner',
          duration: '4 weeks',
          lessons: 16,
          rating: 4.9,
          enrolled: 890,
          image: 'https://picsum.photos/400/200?random=harar1'
        },
        {
          id: 'muslim-3',
          title: 'Islamic Manuscripts and Calligraphy',
          description: 'Learn about the beautiful Islamic manuscripts, Arabic calligraphy, and scholarly traditions in Ethiopian Islam.',
          category: 'Islamic Arts',
          difficulty: 'Advanced',
          duration: '8 weeks',
          lessons: 32,
          rating: 4.7,
          enrolled: 675,
          image: 'https://picsum.photos/400/200?random=calligraphy1'
        },
        {
          id: 'muslim-4',
          title: 'Muslim Traders and the Trade Routes',
          description: 'Understand the role of Muslim merchants in establishing trade routes and spreading Islamic culture across Ethiopia.',
          category: 'Islamic History',
          difficulty: 'Intermediate',
          duration: '5 weeks',
          lessons: 20,
          rating: 4.6,
          enrolled: 980,
          image: 'https://picsum.photos/400/200?random=trade1'
        },
        {
          id: 'muslim-5',
          title: 'Sufi Traditions in Ethiopia',
          description: 'Explore the mystical traditions of Sufism in Ethiopia, including shrines, practices, and spiritual teachings.',
          category: 'Islamic Spirituality',
          difficulty: 'Intermediate',
          duration: '6 weeks',
          lessons: 18,
          rating: 4.8,
          enrolled: 720,
          image: 'https://picsum.photos/400/200?random=sufi1'
        },
        {
          id: 'muslim-6',
          title: 'Islamic Festivals and Celebrations',
          description: 'Learn about Islamic festivals, traditions, and cultural celebrations in Ethiopian Muslim communities.',
          category: 'Islamic Culture',
          difficulty: 'Beginner',
          duration: '3 weeks',
          lessons: 12,
          rating: 4.9,
          enrolled: 1100,
          image: 'https://picsum.photos/400/200?random=festival1'
        }
      ];

      setCourses([...coursesData, ...muslimHeritageCourses]);
      setProgress(progressData);
      setAchievements(achievementsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Failed to load learning data:', error);
      // Fallback to Muslim heritage courses only if service fails
      const fallbackCourses = [
        {
          id: 'muslim-1',
          title: 'Islamic History of Ethiopia',
          description: 'Explore the rich Islamic heritage of Ethiopia from the arrival of Islam in the 7th century to the modern era.',
          category: 'Islamic Heritage',
          difficulty: 'Intermediate',
          duration: '6 weeks',
          lessons: 24,
          rating: 4.8,
          enrolled: 1250,
          image: 'https://picsum.photos/400/200?random=islamic1'
        },
        {
          id: 'muslim-2',
          title: 'Harar: The Fourth Holy City of Islam',
          description: 'Discover the sacred city of Harar, its 99 mosques, Islamic architecture, and role in Islamic scholarship.',
          category: 'Islamic Architecture',
          difficulty: 'Beginner',
          duration: '4 weeks',
          lessons: 16,
          rating: 4.9,
          enrolled: 890,
          image: 'https://picsum.photos/400/200?random=harar1'
        },
        {
          id: 'muslim-3',
          title: 'Islamic Manuscripts and Calligraphy',
          description: 'Learn about the beautiful Islamic manuscripts, Arabic calligraphy, and scholarly traditions in Ethiopian Islam.',
          category: 'Islamic Arts',
          difficulty: 'Advanced',
          duration: '8 weeks',
          lessons: 32,
          rating: 4.7,
          enrolled: 675,
          image: 'https://picsum.photos/400/200?random=calligraphy1'
        },
        {
          id: 'muslim-4',
          title: 'Muslim Traders and the Trade Routes',
          description: 'Understand the role of Muslim merchants in establishing trade routes and spreading Islamic culture across Ethiopia.',
          category: 'Islamic History',
          difficulty: 'Intermediate',
          duration: '5 weeks',
          lessons: 20,
          rating: 4.6,
          enrolled: 980,
          image: 'https://picsum.photos/400/200?random=trade1'
        },
        {
          id: 'muslim-5',
          title: 'Sufi Traditions in Ethiopia',
          description: 'Explore the mystical traditions of Sufism in Ethiopia, including shrines, practices, and spiritual teachings.',
          category: 'Islamic Spirituality',
          difficulty: 'Intermediate',
          duration: '6 weeks',
          lessons: 18,
          rating: 4.8,
          enrolled: 720,
          image: 'https://picsum.photos/400/200?random=sufi1'
        },
        {
          id: 'muslim-6',
          title: 'Islamic Festivals and Celebrations',
          description: 'Learn about Islamic festivals, traditions, and cultural celebrations in Ethiopian Muslim communities.',
          category: 'Islamic Culture',
          difficulty: 'Beginner',
          duration: '3 weeks',
          lessons: 12,
          rating: 4.9,
          enrolled: 1100,
          image: 'https://picsum.photos/400/200?random=festival1'
        }
      ];
      setCourses(fallbackCourses);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading educational content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-primary-foreground/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <GraduationCap className="w-5 h-5 mr-2" />
              <span className="text-sm font-semibold">Ethiopian Heritage Education</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Ethiopia's Rich Heritage
            </h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
              Discover thousands of years of history, culture, and traditions through 
              interactive courses, immersive experiences, and expert-guided lessons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setActiveTab('courses')}
                className="bg-primary-foreground text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary-foreground/90 transition-colors flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning
              </button>
              <button 
                onClick={() => setActiveTab('progress')}
                className="border-2 border-primary-foreground/30 text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary-foreground/10 transition-colors flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 mr-2" />
                View Progress
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview */}
      {progress && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed Lessons</p>
                    <p className="text-3xl font-bold text-card-foreground">{progress.completedLessons || 0}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                    <p className="text-3xl font-bold text-card-foreground">{progress.currentStreak || 0}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                    <p className="text-3xl font-bold text-card-foreground">{progress.points || 0}</p>
                  </div>
                  <Star className="w-8 h-8 text-accent" />
                </div>
              </div>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Level</p>
                    <p className="text-3xl font-bold text-card-foreground">{progress.level || 1}</p>
                  </div>
                  <Award className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {[
              { id: 'courses', label: 'All Courses', icon: BookOpen },
              { id: 'progress', label: 'My Progress', icon: Target },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'recommendations', label: 'Recommended', icon: Sparkles }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-card-foreground hover:bg-muted border border-border'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          {activeTab === 'courses' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4 md:mb-0">Featured Courses</h2>
                
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {['all', 'Islamic Heritage', 'Islamic Architecture', 'Islamic Arts', 'Islamic History', 'Islamic Spirituality', 'Islamic Culture'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-card text-card-foreground hover:bg-muted border border-border'
                      }`}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses
                  .filter(course => selectedCategory === 'all' || course.category === selectedCategory)
                  .map((course) => (
                  <div key={course.id} className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={course.image || 'https://picsum.photos/400/200?random=' + course.id}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center text-white text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="mr-4">{course.duration}</span>
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span>{course.lessons} lessons</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                          {course.category}
                        </span>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          {course.enrolled} enrolled
                        </div>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center">
                          <Play className="w-4 h-4 mr-2" />
                          Start Course
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Your Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <Trophy className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-card-foreground mb-1">{achievement.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-semibold text-sm">+{achievement.points} points</span>
                          <span className="text-muted-foreground text-xs">
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((item) => (
                  <div key={item.id} className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
                    <img 
                      src={item.image || 'https://picsum.photos/300/150?random=' + item.id}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-semibold capitalize">
                          {item.type}
                        </span>
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-card-foreground mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3">{item.reason}</p>
                      <button className="w-full bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Explore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && progress && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">Learning Progress</h2>
              <div className="bg-card rounded-3xl p-8 border border-border">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 mx-auto mb-4 relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-primary"
                        strokeDasharray={`${(progress.completedLessons / (progress.totalLessons || 1)) * 314} 314`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-card-foreground">
                          {Math.round((progress.completedLessons / (progress.totalLessons || 1)) * 100)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Complete</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Great Progress!</h3>
                  <p className="text-muted-foreground">
                    You've completed {progress.completedLessons} out of {progress.totalLessons || 0} lessons
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-primary/5 rounded-2xl">
                    <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground">{progress.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-2xl">
                    <Clock className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground">
                      {Math.round((progress.totalTimeSpent || 0) / 60)}h
                    </div>
                    <div className="text-sm text-muted-foreground">Time Spent</div>
                  </div>
                  <div className="text-center p-4 bg-accent/5 rounded-2xl">
                    <Award className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold text-card-foreground">{progress.level}</div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners exploring Ethiopia's rich heritage through our interactive courses and experiences.
          </p>
          <Link to="/auth">
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6 mr-2" />
              Get Started Today
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Learning;
