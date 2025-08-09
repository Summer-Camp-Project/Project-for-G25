import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import {
  Box, Typography, Tabs, Tab, Container, Grid, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, IconButton, Chip, Avatar, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Museum as MuseumIcon,
  ArtTrack as ArtTrackIcon,
  EventAvailable as EventAvailableIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

// Mock data - Replace with API calls
const mockArtifacts = [
  { id: 1, name: 'Ancient Vase', status: 'on_display', lastUpdated: '2025-08-01' },
  { id: 2, name: 'Historical Painting', status: 'in_storage', lastUpdated: '2025-08-05' },
  { id: 3, name: 'Sculpture', status: 'on_display', lastUpdated: '2025-08-07' },
];

const mockRentalRequests = [
  { id: 1, artifact: 'Ancient Vase', requester: 'Exhibition Co.', status: 'pending', date: '2025-08-10' },
  { id: 2, artifact: 'Historical Painting', requester: 'University', status: 'approved', date: '2025-08-15' },
];

const MuseumDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [artifacts, setArtifacts] = useState(mockArtifacts);
  const [rentalRequests, setRentalRequests] = useState(mockRentalRequests);
  const [openArtifactDialog, setOpenArtifactDialog] = useState(false);
  const [openRentalDialog, setOpenRentalDialog] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState(null);
  const [currentRental, setCurrentRental] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a museum admin
  useEffect(() => {
    if (!user || user.role !== 'museum_admin') {
      router.push('/login');
    }
  }, [user, router]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleArtifactSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement artifact creation/update
    setOpenArtifactDialog(false);
  };

  const handleRentalAction = (requestId, action) => {
    // TODO: Implement rental request action
    setRentalRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: action } : req
    ));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <MuseumIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h4" component="h1">
          {user.museumName || 'Museum'} Dashboard
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <ArtTrackIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">Total Artifacts</Typography>
              <Typography variant="h5">{artifacts.length}</Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <EventAvailableIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">Active Rentals</Typography>
              <Typography variant="h5">
                {rentalRequests.filter(r => r.status === 'approved').length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <StorageIcon color="info" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">In Storage</Typography>
              <Typography variant="h5">
                {artifacts.filter(a => a.status === 'in_storage').length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Artifacts" />
          <Tab label="Rental Requests" />
          <Tab label="Museum Profile" />
          <Tab label="Analytics" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Artifact Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setCurrentArtifact(null);
                    setOpenArtifactDialog(true);
                  }}
                >
                  Add Artifact
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Updated</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {artifacts.map((artifact) => (
                      <TableRow key={artifact.id}>
                        <TableCell>{artifact.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={artifact.status.replace('_', ' ')}
                            color={artifact.status === 'on_display' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{artifact.lastUpdated}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => setCurrentArtifact(artifact)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 1 && (
            <>
              <Typography variant="h6" gutterBottom>Rental Requests</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Artifact</TableCell>
                      <TableCell>Requester</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rentalRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>{request.artifact}</TableCell>
                        <TableCell>{request.requester}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={request.status}
                            color={
                              request.status === 'approved' ? 'success' :
                              request.status === 'rejected' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <>
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => handleRentalAction(request.id, 'approved')}
                              >
                                <CheckIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRentalAction(request.id, 'rejected')}
                              >
                                <CloseIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Museum Profile</Typography>
              <form>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Museum Name"
                      defaultValue={user.museumName || ''}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      defaultValue=""
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          width: 150,
                          height: 150,
                          mx: 'auto',
                          mb: 2,
                          bgcolor: 'primary.main'
                        }}
                      >
                        <ImageIcon sx={{ fontSize: 60 }} />
                      </Avatar>
                      <Button variant="outlined" component="label">
                        Upload Logo
                        <input type="file" hidden accept="image/*" />
                      </Button>
                    </Box>
                    <TextField
                      fullWidth
                      label="Contact Email"
                      type="email"
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary">
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Analytics</Typography>
              <Typography color="text.secondary">
                Analytics dashboard will be available soon. This section will display:
              </Typography>
              <ul>
                <li>Visitor statistics</li>
                <li>Artifact popularity</li>
                <li>Rental history</li>
                <li>Engagement metrics</li>
              </ul>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Artifact Dialog */}
      <Dialog open={openArtifactDialog} onClose={() => setOpenArtifactDialog(false)}>
        <form onSubmit={handleArtifactSubmit}>
          <DialogTitle>{currentArtifact ? 'Edit Artifact' : 'Add New Artifact'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Artifact Name"
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              defaultValue={currentArtifact?.name || ''}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                defaultValue={currentArtifact?.status || 'in_storage'}
              >
                <MenuItem value="in_storage">In Storage</MenuItem>
                <MenuItem value="on_display">On Display</MenuItem>
                <MenuItem value="under_maintenance">Under Maintenance</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenArtifactDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {currentArtifact ? 'Update' : 'Add'} Artifact
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default MuseumDashboard;