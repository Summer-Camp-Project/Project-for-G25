import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Rating,
  Tab,
  Tabs
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CompletedIcon,
  Schedule as TimeIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Forum as ForumIcon,
  Star as StarIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Download as DownloadIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    fetchUserProgress();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/learning/courses/${courseId}`);
      const data = await response.json();
      
      if (data.success) {
        setCourse(data.course);
      } else {
        toast.error('Course not found');
        navigate('/learning/courses');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/learning/progress', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success && data.progress) {
        const courseProgress = data.progress.courses?.find(c => c.courseId === courseId);
        if (courseProgress) {
          setUserProgress(courseProgress);
          setEnrolled(true);
        }
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrollmentLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to enroll');
        navigate('/auth/login');
        return;
      }

      const response = await fetch(`/api/learning/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setEnrolled(true);
        setUserProgress(data.courseProgress);
        toast.success('Successfully enrolled in course!');
      } else {
        toast.error(data.message || 'Failed to enroll');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleLessonPlay = async (lesson) => {
    if (!enrolled) {
      toast.error('Please enroll first to access lessons');
      return;
    }
    
    setCurrentLesson(lesson);
    setPlayerOpen(true);
    
    // Start lesson
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/learning/lessons/${lesson._id}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const handleLessonComplete = async (lesson) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/learning/lessons/${lesson._id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeSpent: 30, // Mock time spent
          score: 85 // Mock score
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Lesson completed!');
        fetchUserProgress(); // Refresh progress
        setPlayerOpen(false);
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to complete lesson');
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLessonStatus = (lessonId) => {
    if (!userProgress || !userProgress.lessons) return 'not_started';
    const lessonProgress = userProgress.lessons.find(l => l.lessonId === lessonId);
    return lessonProgress?.status || 'not_started';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Course Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h3" color="white" gutterBottom>
              {course.title}
            </Typography>
            <Typography variant="h6" color="rgba(255,255,255,0.9)" paragraph>
              {course.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={course.category} color="secondary" sx={{ textTransform: 'capitalize' }} />
              <Chip label={course.difficulty} color="warning" sx={{ textTransform: 'capitalize' }} />
              <Chip 
                icon={<TimeIcon />} 
                label={formatDuration(course.estimatedDuration)} 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'white' }} 
              />
              <Chip 
                icon={<SchoolIcon />} 
                label={`${course.lessons?.length || 0} lessons`} 
                variant="outlined" 
                sx={{ color: 'white', borderColor: 'white' }} 
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={4.5} precision={0.5} readOnly sx={{ color: '#ffd700' }} />
              <Typography color="rgba(255,255,255,0.9)">4.5 (123 reviews)</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <Avatar sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }}>
                    {course.instructor?.charAt(0) || 'I'}
                  </Avatar>
                  <Typography variant="h6">{course.instructor || 'Heritage Expert'}</Typography>
                  <Typography variant="body2" color="text.secondary">Instructor</Typography>
                </Box>
                
                {enrolled ? (
                  <Box>
                    <Typography variant="h6" color="success.main" gutterBottom>
                      ✓ Enrolled
                    </Typography>
                    {userProgress && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Progress: {userProgress.progressPercentage || 0}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={userProgress.progressPercentage || 0} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => setTabValue(1)}
                      sx={{ mb: 1 }}
                    >
                      Continue Learning
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleEnroll}
                    disabled={enrollmentLoading}
                    sx={{ mb: 2 }}
                  >
                    {enrollmentLoading ? <CircularProgress size={24} /> : 'Enroll Now - Free'}
                  </Button>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                  <Tooltip title="Share course">
                    <IconButton><ShareIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Bookmark">
                    <IconButton><BookmarkIcon /></IconButton>
                  </Tooltip>
                  <Tooltip title="Download syllabus">
                    <IconButton><DownloadIcon /></IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Course Content */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Curriculum" />
            <Tab label="Assignments" />
            <Tab label="Discussions" />
            <Tab label="Reviews" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Overview Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>What you'll learn</Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  'Understand the historical context of Ethiopian civilizations',
                  'Explore archaeological discoveries and their significance',
                  'Learn about cultural traditions and their modern relevance',
                  'Develop critical thinking skills in heritage studies'
                ].map((objective, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      <Typography variant="body1">{objective}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>Requirements</Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Basic understanding of Ethiopian geography" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Interest in history and culture" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="No prior knowledge required" />
                </ListItem>
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h5" gutterBottom>Description</Typography>
              <Typography variant="body1" paragraph>
                Embark on a fascinating journey through Ethiopia's rich historical tapestry in this comprehensive course. 
                From the legendary Queen of Sheba to the magnificent rock churches of Lalibela, discover the stories 
                that have shaped one of Africa's most culturally diverse nations.
              </Typography>
              <Typography variant="body1" paragraph>
                This course combines archaeological evidence with oral traditions to provide a complete picture of 
                Ethiopian heritage. You'll explore ancient kingdoms, religious developments, and cultural practices 
                that continue to influence modern Ethiopia.
              </Typography>
            </Box>
          )}

          {/* Curriculum Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>Course Curriculum</Typography>
              {course.lessons?.length > 0 ? (
                course.lessons.map((lesson, index) => {
                  const status = getLessonStatus(lesson._id);
                  return (
                    <Accordion key={lesson._id} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {status === 'completed' ? (
                              <CompletedIcon color="success" />
                            ) : (
                              <Box sx={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: '50%', 
                                border: '2px solid #ccc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                fontWeight: 'bold'
                              }}>
                                {index + 1}
                              </Box>
                            )}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{lesson.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDuration(lesson.estimatedDuration)}
                            </Typography>
                          </Box>
                          {enrolled && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<PlayIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLessonPlay(lesson);
                              }}
                            >
                              {status === 'completed' ? 'Review' : 'Start'}
                            </Button>
                          )}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" paragraph>
                          {lesson.description}
                        </Typography>
                        {lesson.objectives?.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>Learning Objectives:</Typography>
                            <List dense>
                              {lesson.objectives.map((objective, objIndex) => (
                                <ListItem key={objIndex}>
                                  <ListItemIcon>
                                    <CheckCircleIcon fontSize="small" color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={objective} />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              ) : (
                <Alert severity="info">No lessons available yet</Alert>
              )}
            </Box>
          )}

          {/* Assignments Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>Assignments</Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Assignments will be available after enrollment and course progress.
              </Alert>
              {enrolled && (
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AssignmentIcon color="primary" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">Final Essay Assignment</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Write a comprehensive analysis of Ethiopian heritage themes
                        </Typography>
                      </Box>
                      <Chip label="Due: 7 days" color="warning" size="small" />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Box>
          )}

          {/* Discussions Tab */}
          {tabValue === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>Course Discussions</Typography>
              <Alert severity="info">
                Join course discussions to interact with fellow learners and instructors.
              </Alert>
              {enrolled && (
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" startIcon={<ForumIcon />}>
                    Join Discussions
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {/* Reviews Tab */}
          {tabValue === 4 && (
            <Box>
              <Typography variant="h5" gutterBottom>Student Reviews</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Rating value={4.5} precision={0.5} readOnly size="large" />
                <Typography variant="h4">4.5</Typography>
                <Typography variant="body1" color="text.secondary">(123 reviews)</Typography>
              </Box>
              
              {/* Mock Reviews */}
              {[1, 2, 3].map((review) => (
                <Card key={review} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Avatar>S</Avatar>
                      <Box>
                        <Typography variant="subtitle1">Student {review}</Typography>
                        <Rating value={5} size="small" readOnly />
                      </Box>
                    </Box>
                    <Typography variant="body1">
                      Excellent course! Very informative and well-structured. The instructor explains 
                      complex historical concepts in an easy-to-understand manner.
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Lesson Player Modal */}
      <Dialog 
        open={playerOpen} 
        onClose={() => setPlayerOpen(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { height: '80vh' } }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">{currentLesson?.title}</Typography>
            <IconButton onClick={() => setPlayerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {currentLesson && (
            <Box>
              {/* Video Player Placeholder */}
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 300, 
                  bgcolor: '#000', 
                  borderRadius: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3
                }}
              >
                <Typography color="white" variant="h5">
                  Video Player - {currentLesson.title}
                </Typography>
              </Box>
              
              <Typography variant="h6" gutterBottom>Lesson Content</Typography>
              <Typography variant="body1" paragraph>
                {currentLesson.description}
              </Typography>
              
              {currentLesson.objectives?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>Learning Objectives:</Typography>
                  <List>
                    {currentLesson.objectives.map((objective, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={objective} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPlayerOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => handleLessonComplete(currentLesson)}
          >
            Complete Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseDetail;
