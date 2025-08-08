import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import UserManagement from '../components/dashboard/UserManagement';
import {
  Box, Typography, Tabs, Tab, Container, Grid, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Card, CardContent, 
  CircularProgress, Alert, AppBar, Toolbar, CssBaseline, useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  CheckCircle as CheckCircleIcon,
  Museum as MuseumIcon,
  ArtTrack as ArtTrackIcon,
  Delete as DeleteIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// Mock data
const mockUsers = [
  { id: 1, name: 'Admin 1', email: 'admin1@museum.com', status: 'pending', role: 'admin' },
  { id: 2, name: 'Admin 2', email: 'admin2@museum.com', status: 'approved', role: 'admin' },
];

const mockArtifacts = [
  { id: 1, name: 'Artifact 1', status: 'pending', submittedBy: 'Admin 1', date: '2025-08-05' },
  { id: 2, name: 'Artifact 2', status: 'approved', submittedBy: 'Admin 2', date: '2025-08-06' },
];

// Import AnalyticsCard
import AnalyticsCard from '../components/dashboard/AnalyticsCard';

// Dashboard Component
const DashboardOverview = () => {
  // Mock data for the analytics cards
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalMuseums: 45,
    pendingArtifacts: 23,
    approvedArtifacts: 342,
    totalEvents: 18,
    userGrowth: 12.5, // percentage
    artifactGrowth: 8.2, // percentage
    eventGrowth: -3.1, // percentage
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'medium' }}>
        System Overview
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Users Card */}
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon="users"
            color="primary"
            trend={stats.userGrowth >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(stats.userGrowth)}%`}
            progress={Math.min(100, (stats.activeUsers / stats.totalUsers) * 100)}
            subtitle={`${stats.activeUsers} active users`}
            tooltip="Total number of registered users in the system"
          />
        </Grid>

        {/* Museums Card */}
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Museums"
            value={stats.totalMuseums}
            icon="museums"
            color="secondary"
            trend="up"
            trendValue="5.2%"
            progress={85}
            subtitle="Registered in the platform"
            tooltip="Total number of museums registered in the system"
          />
        </Grid>

        {/* Artifacts Card */}
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Artifacts"
            value={(stats.pendingArtifacts + stats.approvedArtifacts).toLocaleString()}
            icon="artifacts"
            color="success"
            trend={stats.artifactGrowth >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(stats.artifactGrowth)}%`}
            progress={Math.round((stats.approvedArtifacts / (stats.pendingArtifacts + stats.approvedArtifacts)) * 100)}
            subtitle={`${stats.pendingArtifacts} pending approval`}
            tooltip="Total artifacts in the system (approved and pending)"
          />
        </Grid>

        {/* Events Card */}
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Upcoming Events"
            value={stats.totalEvents}
            icon="events"
            color="warning"
            trend={stats.eventGrowth >= 0 ? 'up' : 'down'}
            trendValue={`${Math.abs(stats.eventGrowth)}%`}
            progress={60}
            subtitle="Scheduled for this month"
            tooltip="Number of upcoming events in the next 30 days"
          />
        </Grid>
      </Grid>

      {/* Additional Stats Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>User Activity</Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.activeUsers} active users in the last 30 days
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(100, (stats.activeUsers / stats.totalUsers) * 100)} 
                  color="primary"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Artifact Status</Typography>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Approved: {stats.approvedArtifacts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending: {stats.pendingArtifacts}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                <Box 
                  sx={{ 
                    width: `${(stats.approvedArtifacts / (stats.approvedArtifacts + stats.pendingArtifacts)) * 100}%`,
                    bgcolor: 'success.main'
                  }}
                />
                <Box 
                  sx={{ 
                    width: `${(stats.pendingArtifacts / (stats.approvedArtifacts + stats.pendingArtifacts)) * 100}%`,
                    bgcolor: 'warning.main'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// User Management Component
const UserManagement = ({ users, onApprove, onReject }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add User
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.status} 
                    color={user.status === 'approved' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewUser(user)}>
                    <EditIcon />
                  </IconButton>
                  {user.status === 'pending' && (
                    <>
                      <IconButton onClick={() => onApprove(user.id)}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                      <IconButton onClick={() => onReject(user.id)}>
                        <PersonRemoveIcon color="error" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
              <Typography><strong>Status:</strong> {selectedUser.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Artifact Approval Component
const ArtifactApproval = ({ artifacts, onApprove, onReject }) => {
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    setIsDialogOpen(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Artifact Approval</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Submitted By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {artifacts.map((artifact) => (
              <TableRow key={artifact.id}>
                <TableCell>{artifact.name}</TableCell>
                <TableCell>{artifact.submittedBy}</TableCell>
                <TableCell>
                  <Chip 
                    label={artifact.status} 
                    color={artifact.status === 'approved' ? 'success' : 'warning'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleViewArtifact(artifact)}>
                    <EditIcon />
                  </IconButton>
                  {artifact.status === 'pending' && (
                    <>
                      <IconButton onClick={() => onApprove(artifact.id)}>
                        <CheckCircleIcon color="success" />
                      </IconButton>
                      <IconButton onClick={() => onReject(artifact.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Artifact Details</DialogTitle>
        <DialogContent>
          {selectedArtifact && (
            <Box>
              <Typography><strong>Name:</strong> {selectedArtifact.name}</Typography>
              <Typography><strong>Status:</strong> {selectedArtifact.status}</Typography>
              <Typography><strong>Submitted By:</strong> {selectedArtifact.submittedBy}</Typography>
              <Typography><strong>Date:</strong> {selectedArtifact.date}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [artifacts, setArtifacts] = useState(mockArtifacts);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close mobile drawer when route changes
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [router.pathname, isMobile]);

  // Redirect if not authenticated or not a super admin
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (user.role !== 'super_admin') {
      router.push('/');
      return;
    }

    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, router]);

  const handleApproveUser = (userId) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: 'approved' } : u
    ));
  };

  const handleRejectUser = (userId) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleApproveArtifact = (artifactId) => {
    setArtifacts(artifacts.map(a => 
      a.id === artifactId ? { ...a, status: 'approved' } : a
    ));
  };

  const handleRejectArtifact = (artifactId) => {
    setArtifacts(artifacts.filter(a => a.id !== artifactId));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  // Handle refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setSnackbar({
      open: true,
      message: 'Data refreshed successfully',
      severity: 'success',
    });
  };

  // Tab configuration
  const tabs = [
    { label: 'Dashboard', icon: <DashboardIcon />, component: <DashboardOverview /> },
    { 
      label: 'Users', 
      icon: <PersonIcon />, 
      component: (
        <UserManagement 
          users={users}
          onApprove={handleApproveUser}
          onReject={handleRejectUser}
          onRefresh={handleRefresh}
          loading={isLoading}
        />
      ) 
    },
    { 
      label: 'Artifacts', 
      icon: <ArtTrackIcon />, 
      component: (
        <ArtifactApproval 
          artifacts={artifacts}
          onApprove={handleApproveArtifact}
          onReject={handleRejectArtifact}
        />
      ) 
    },
  ];

  // Layout for the main content
  const mainContent = (
    <Box 
      component="main" 
      sx={{ 
        flexGrow: 1, 
        p: 3,
        width: { sm: `calc(100% - ${240}px)` },
        ml: { sm: '240px' },
        mt: { xs: '56px', sm: '64px' } // Adjust for AppBar height
      }}
    >
      <Toolbar /> {/* This pushes content below the AppBar */}
      <Box sx={{ maxWidth: '100%' }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="admin dashboard tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab, index) => (
              <Tab 
                key={index} 
                label={tab.label} 
                icon={tab.icon} 
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box>
          {tabs[tabValue].component}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {tabs[tabValue]?.label || 'Admin Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      {/* Sidebar */}
      <Sidebar 
        open={mobileOpen} 
        onClose={handleDrawerToggle}
        selectedTab={tabValue}
        onTabChange={handleTabChange}
      />
      
      {/* Main Content */}
      {mainContent}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
