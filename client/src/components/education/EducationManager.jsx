import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Edit3, Trash2, Users, Star, Eye, Calendar, MapPin,
  Award, MessageSquare, FileText, CheckCircle, Clock, Search, Filter,
  Send, Reply, ThumbsUp, Upload, Download, Play, Pause
} from 'lucide-react';
import educationApi from '../../services/educationApi';
import { useAuth } from '../../hooks/useAuth';

const EducationManager = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Data states
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewingItem, setViewingItem] = useState(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    completedAssignments: 0,
    activeDiscussions: 0
  });

  // Form data
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'Ethiopian History',
    difficulty: 'Beginner',
    duration: 4,
    maxStudents: 30,
    startDate: '',
    endDate: '',
    price: 0,
    curriculum: [''],
    prerequisites: [''],
    learningOutcomes: ['']
  });

  const [assignmentForm, setAssignmentForm] = useState({
    courseId: '',
    title: '',
    description: '',
    type: 'essay',
    dueDate: '',
    maxPoints: 100,
    instructions: '',
    resources: [''],
    rubric: ''
  });

  const [discussionForm, setDiscussionForm] = useState({
    courseId: '',
    title: '',
    description: '',
    category: 'general',
    isPinned: false
  });

  const categories = [
    'Ethiopian History', 'Cultural Heritage', 'Archaeological Studies',
    'Religious Heritage', 'Traditional Arts', 'Modern Ethiopia',
    'Language Studies', 'Music and Dance', 'Architecture'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const assignmentTypes = ['essay', 'quiz', 'project', 'presentation', 'research'];
  const discussionCategories = ['general', 'course-content', 'assignments', 'resources', 'announcements'];

  // Load data from API
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get organizer ID from auth context
      const organizerId = user?.id;
      
      // Load dashboard stats
      try {
        const dashboardResponse = await educationApi.getDashboard(organizerId);
        if (dashboardResponse?.success && dashboardResponse.data) {
          setStats(dashboardResponse.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      }

      // Load courses
      try {
        const coursesResponse = await educationApi.getCourses({}, organizerId);
        if (coursesResponse?.success) {
          setCourses(Array.isArray(coursesResponse.data) ? coursesResponse.data : []);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
        setCourses([]);
      }

      // Load assignments  
      try {
        const assignmentsResponse = await educationApi.getAssignments({}, organizerId);
        if (assignmentsResponse?.success) {
          setAssignments(Array.isArray(assignmentsResponse.data) ? assignmentsResponse.data : []);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error('Failed to load assignments:', error);
        setAssignments([]);
      }

      // Load discussions
      try {
        const discussionsResponse = await educationApi.getDiscussions();
        if (discussionsResponse?.success) {
          setDiscussions(Array.isArray(discussionsResponse.data) ? discussionsResponse.data : []);
        } else {
          setDiscussions([]);
        }
      } catch (error) {
        console.error('Failed to load discussions:', error);
        setDiscussions([]);
      }

      // Load students
      try {
        const studentsResponse = await educationApi.getStudents();
        if (studentsResponse?.success) {
          setStudents(Array.isArray(studentsResponse.data) ? studentsResponse.data : []);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error('Failed to load students:', error);
        setStudents([]);
      }

    } catch (error) {
      console.error('Error loading education data:', error);
      // Fallback to mock data if API fails
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Fallback mock data in case API fails
    setCourses([
      {
        id: '1',
        title: 'Ancient Kingdoms of Ethiopia',
        description: 'Comprehensive study of Ethiopia\'s ancient civilizations',
        category: 'Ethiopian History',
        difficulty: 'Intermediate',
        duration: 8,
        maxStudents: 25,
        enrolledStudents: 18,
        startDate: '2024-03-01',
        endDate: '2024-04-30',
        price: 1200,
        status: 'active',
        instructor: 'Dr. Yonas Beyene',
        rating: 4.7,
        completionRate: 85,
        totalLessons: 24,
        completedLessons: 15
      }
    ]);

    setAssignments([
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
        averageScore: 87
      }
    ]);

    setDiscussions([
      {
        id: '1',
        courseId: '1',
        courseName: 'Ancient Kingdoms of Ethiopia',
        title: 'Archaeological Evidence of Aksum',
        description: 'Discussion on recent archaeological discoveries',
        category: 'course-content',
        author: 'Dr. Yonas Beyene',
        createdAt: '2024-02-20',
        replies: 23,
        lastActivity: '2024-02-25',
        isPinned: true,
        participants: 15
      }
    ]);

    setStudents([
      { id: '1', name: 'Alemayehu Tadesse', email: 'alemayehu@email.com', enrolledCourses: 2, completedAssignments: 8, totalAssignments: 10, avgGrade: 88 }
    ]);

    setStats({
      totalCourses: 12,
      activeCourses: 8,
      totalStudents: 156,
      totalAssignments: 24,
      completedAssignments: 18,
      activeDiscussions: 15
    });
  };

  const addArrayField = (form, setForm, field) => {
    setForm({
      ...form,
      [field]: [...form[field], '']
    });
  };

  const updateArrayField = (form, setForm, field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm({ ...form, [field]: updated });
  };

  const removeArrayField = (form, setForm, field, index) => {
    setForm({
      ...form,
      [field]: form[field].filter((_, i) => i !== index)
    });
  };

  const handleCreateCourse = async () => {
    try {
      // Add organizer ID to course form
      const courseData = {
        ...courseForm,
        organizerId: user?.id
      };
      
      const response = await educationApi.createCourse(courseData);
      if (response.success) {
        setCourses([...courses, response.data]);
        setShowCreateCourse(false);
        resetCourseForm();
        alert('Course created successfully!');
        // Reload stats
        const dashboardResponse = await educationApi.getDashboard(user?.id);
        if (dashboardResponse.success) {
          setStats(dashboardResponse.data);
        }
      } else {
        alert('Error creating course: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course: ' + error.message);
    }
  };

  const resetCourseForm = () => {
    setCourseForm({
      title: '', description: '', category: 'Ethiopian History', difficulty: 'Beginner',
      duration: 4, maxStudents: 30, startDate: '', endDate: '', price: 0,
      curriculum: [''], prerequisites: [''], learningOutcomes: ['']
    });
  };

  const handleCreateAssignment = async () => {
    try {
      // Add organizer ID to assignment form
      const assignmentData = {
        ...assignmentForm,
        organizerId: user?.id
      };
      
      const response = await educationApi.createAssignment(assignmentData);
      if (response.success) {
        setAssignments([...assignments, response.data]);
        setShowCreateAssignment(false);
        resetAssignmentForm();
        alert('Assignment created successfully!');
      } else {
        alert('Error creating assignment: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment: ' + error.message);
    }
  };

  const resetAssignmentForm = () => {
    setAssignmentForm({
      courseId: '', title: '', description: '', type: 'essay', dueDate: '',
      maxPoints: 100, instructions: '', resources: [''], rubric: ''
    });
  };

  const handleCreateDiscussion = async () => {
    try {
      // Add organizer ID to discussion form
      const discussionData = {
        ...discussionForm,
        organizerId: user?.id
      };
      
      const response = await educationApi.createDiscussion(discussionData);
      if (response.success) {
        setDiscussions([...discussions, response.data]);
        setShowCreateDiscussion(false);
        resetDiscussionForm();
        alert('Discussion created successfully!');
      } else {
        alert('Error creating discussion: ' + response.message);
      }
    } catch (error) {
      console.error('Error creating discussion:', error);
      alert('Error creating discussion: ' + error.message);
    }
  };

  const resetDiscussionForm = () => {
    setDiscussionForm({
      courseId: '', title: '', description: '', category: 'general', isPinned: false
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderCoursesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Course Management</h3>
        <button
          onClick={() => setShowCreateCourse(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{course.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{course.description}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    {course.enrolledStudents}/{course.maxStudents} students
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {course.duration} weeks
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {course.rating.toFixed(1)} rating
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4" />
                    {course.completionRate}% completion
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setViewingItem(course)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingItem(course);
                    setCourseForm(course);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this course?')) {
                      setCourses(courses.filter(c => c.id !== course.id));
                    }
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Course Progress</span>
                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(course.completedLessons / course.totalLessons) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {course.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
              </span>
              <span className="font-medium text-blue-600">{course.price} ETB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignmentsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Assignment Management</h3>
        <button
          onClick={() => setShowCreateAssignment(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Assignment
        </button>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{assignment.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {assignment.type}
                  </span>
                </div>
                <p className="text-blue-600 text-sm mb-2">{assignment.courseName}</p>
                <p className="text-gray-600 mb-3">{assignment.description}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    {assignment.submittedCount}/{assignment.totalStudents} submitted
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="w-4 h-4" />
                    {assignment.maxPoints} points
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    Avg: {assignment.averageScore}%
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Submission Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Submissions</span>
                <span>{assignment.submittedCount}/{assignment.totalStudents}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(assignment.submittedCount / assignment.totalStudents) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDiscussionsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Discussion Management</h3>
        <button
          onClick={() => setShowCreateDiscussion(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Discussion
        </button>
      </div>

      {/* Discussions Grid */}
      <div className="grid gap-6">
        {discussions.map((discussion) => (
          <div key={discussion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">{discussion.title}</h4>
                  {discussion.isPinned && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Pinned
                    </span>
                  )}
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                    {discussion.category}
                  </span>
                </div>
                <p className="text-blue-600 text-sm mb-2">{discussion.courseName}</p>
                <p className="text-gray-600 mb-3">{discussion.description}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    {discussion.replies} replies
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    {discussion.participants} participants
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Created: {new Date(discussion.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    Last: {new Date(discussion.lastActivity).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudentsTab = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Student Management</h3>
      
      <div className="grid gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{student.name}</h4>
                <p className="text-gray-600 mb-3">{student.email}</p>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    {student.enrolledCourses} courses
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4" />
                    {student.completedAssignments}/{student.totalAssignments} assignments
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4" />
                    {student.avgGrade}% average
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Assignment Completion</span>
                <span>{student.completedAssignments}/{student.totalAssignments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(student.completedAssignments / student.totalAssignments) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Education Management Portal
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
            <div className="text-gray-600 text-sm">Total Courses</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-2xl font-bold text-green-600">{stats.activeCourses}</div>
            <div className="text-gray-600 text-sm">Active Courses</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <div className="text-gray-600 text-sm">Total Students</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{stats.totalAssignments}</div>
            <div className="text-gray-600 text-sm">Assignments</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="text-2xl font-bold text-red-600">{stats.completedAssignments}</div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">{stats.activeDiscussions}</div>
            <div className="text-gray-600 text-sm">Discussions</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'courses', label: 'Courses', icon: BookOpen },
            { key: 'assignments', label: 'Assignments', icon: FileText },
            { key: 'discussions', label: 'Discussions', icon: MessageSquare },
            { key: 'students', label: 'Students', icon: Users }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                activeTab === tab.key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'courses' && renderCoursesTab()}
        {activeTab === 'assignments' && renderAssignmentsTab()}
        {activeTab === 'discussions' && renderDiscussionsTab()}
        {activeTab === 'students' && renderStudentsTab()}
      </div>

      {/* Create Course Modal */}
      {showCreateCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create New Course</h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks)</label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Students</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={courseForm.maxStudents}
                    onChange={(e) => setCourseForm({ ...courseForm, maxStudents: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={courseForm.startDate}
                    onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={courseForm.endDate}
                    onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label>
                <input
                  type="number"
                  min="0"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: parseFloat(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Curriculum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum Topics</label>
                {courseForm.curriculum.map((topic, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => updateArrayField(courseForm, setCourseForm, 'curriculum', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Curriculum topic"
                    />
                    {courseForm.curriculum.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField(courseForm, setCourseForm, 'curriculum', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField(courseForm, setCourseForm, 'curriculum')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  + Add Topic
                </button>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Course
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateCourse(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreateAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create New Assignment</h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateAssignment(); }} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select
                    value={assignmentForm.courseId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, courseId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.filter(c => c.status === 'active').map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
                  <select
                    value={assignmentForm.type}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, type: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {assignmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Points</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={assignmentForm.maxPoints}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, maxPoints: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={assignmentForm.instructions}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Detailed instructions for students..."
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Create Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateAssignment(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Discussion Modal */}
      {showCreateDiscussion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create New Discussion</h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); handleCreateDiscussion(); }} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select
                    value={discussionForm.courseId}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, courseId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.filter(c => c.status === 'active').map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {discussionCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discussion Title *</label>
                <input
                  type="text"
                  value={discussionForm.title}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={discussionForm.description}
                  onChange={(e) => setDiscussionForm({ ...discussionForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={discussionForm.isPinned}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, isPinned: e.target.checked })}
                    className="mr-2"
                  />
                  Pin this discussion to the top
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
                >
                  Create Discussion
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateDiscussion(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationManager;
