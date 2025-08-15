import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  Construction,
  Schedule,
  TourOutlined,
  EventNote,
  People,
  Assessment,
  Settings,
  Notifications,
  AccountCircle,
  CheckCircle,
  Timeline,
  CalendarToday,
  LocationOn,
  Group,
  Star
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const ComingSoonPage = () => {
  const theme = useTheme();
  const { user } = useAuth();

  const upcomingFeatures = [
    {
      icon: <TourOutlined />,
      title: 'Virtual Tour Management',
      description: 'Create and manage immersive virtual heritage tours',
      status: 'In Development',
      progress: 75
    },
    {
      icon: <EventNote />,
      title: 'Event Scheduling',
      description: 'Schedule live guided tours and educational events',
      status: 'Coming Soon',
      progress: 45
    },
    {
      icon: <People />,
      title: 'Visitor Management',
      description: 'Track and manage tour participants and groups',
      status: 'Planned',
      progress: 25
    },
    {
      icon: <Assessment />,
      title: 'Tour Analytics',
      description: 'Comprehensive analytics for tour performance',
      status: 'Planned',
      progress: 15
    },
    {
      icon: <LocationOn />,
      title: 'Interactive Maps',
      description: 'Interactive heritage site maps and navigation',
      status: 'Coming Soon',
      progress: 60
    },
    {
      icon: <Star />,
      title: 'Rating System',
      description: 'Collect and manage visitor feedback and ratings',
      status: 'Planned',
      progress: 10
    }
  ];

  const currentStats = {
    company: user?.organizerInfo?.company || 'Heritage Tours Ethiopia Ltd.',
    license: user?.organizerInfo?.license || 'HTE-2024-001',
    rating: user?.organizerInfo?.rating || 4.8,
    totalTours: user?.organizerInfo?.totalTours || 150,
    specializations: user?.organizerInfo?.specializations || ['cultural-tours', 'historical-tours', 'archaeological-tours']
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Development': return 'success';
      case 'Coming Soon': return 'warning';
      case 'Planned': return 'info';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Tour Organizer Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Welcome back, {user?.name || 'Tour Organizer'}!
            </Typography>
          </Box>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            <AccountCircle fontSize="inherit" />
          </Avatar>
        </Box>

        {/* Coming Soon Banner */}
        <Paper
          elevation={0}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.primary.main}15)`,
            border: `1px solid ${theme.palette.primary.main}30`,
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0.05,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              pointerEvents: 'none'
            }}
          />
          <Construction 
            sx={{ 
              fontSize: 80, 
              color: 'warning.main', 
              mb: 2,
              animation: 'pulse 2s infinite'
            }} 
          />
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom>
            🚧 Coming Soon! 🚧
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={2}>
            The Tour Organizer Dashboard is Currently Under Development
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
            We're working hard to bring you a comprehensive platform for managing virtual heritage tours, 
            scheduling events, and tracking visitor engagement. Stay tuned for exciting features!
          </Typography>
        </Paper>
      </Box>

      {/* Current Profile Info */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Your Profile
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Group color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Company" 
                    secondary={currentStats.company}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Schedule color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="License" 
                    secondary={currentStats.license}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Star color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Rating" 
                    secondary={`${currentStats.rating}/5.0`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timeline color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Tours Organized" 
                    secondary={`${currentStats.totalTours} tours`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Specializations
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {currentStats.specializations.map((spec, index) => (
                  <Chip 
                    key={index}
                    label={spec.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
              <Box mt={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dashboard Development Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={65} 
                  color="primary" 
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  65% Complete - Expected Launch: Q2 2025
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Features */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Upcoming Features
      </Typography>
      
      <Grid container spacing={3}>
        {upcomingFeatures.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card 
              elevation={2}
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="flex-start" gap={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main'
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Chip 
                        label={feature.status}
                        color={getStatusColor(feature.status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {feature.description}
                    </Typography>
                    <Box mt={2}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Development Progress
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {feature.progress}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={feature.progress} 
                        color={getStatusColor(feature.status)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Stay Updated Section */}
      <Box 
        sx={{
          mt: 6,
          p: 4,
          bgcolor: 'grey.50',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Stay Updated
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Want to be notified when the Tour Organizer Dashboard is ready? 
          We'll keep you informed about our progress!
        </Typography>
        <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
          <Button 
            variant="contained" 
            startIcon={<Notifications />}
            disabled
            sx={{ minWidth: 160 }}
          >
            Notify Me (Soon)
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<Timeline />}
            disabled
            sx={{ minWidth: 160 }}
          >
            View Roadmap (Soon)
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Thank you for your patience as we build something amazing! 🎉
        </Typography>
        <Typography variant="caption" color="text.disabled" display="block" mt={1}>
          For technical support: tech@ethioheritage360.com
        </Typography>
      </Box>
    </Container>
  );
};

export default ComingSoonPage;
