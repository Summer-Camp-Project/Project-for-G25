import React, { useState, useEffect } from 'react';
import MuseumAdminSidebar from '../dashboard/MuseumAdminSidebar';
import {
  Box, Typography, Container, Grid, Paper, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Snackbar, Alert,
  CircularProgress, Tabs, Tab, Tooltip, Divider, FormHelperText
} from '@mui/material';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  AlertTriangle,
  Plus,
  RefreshCw,
  Upload,
  Search,
  Filter
} from 'lucide-react';
import rentalService from '../../services/rentalService';

const RentalManagement = () => {
  // State management
  const [rentalRequests, setRentalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [artifacts, setArtifacts] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalRevenue: 0
  });

  // Dialog states
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Form states
  const [createForm, setCreateForm] = useState({
    artifactId: '',
    virtualMuseumDetails: {
      purpose: '3d_modeling',
      expectedCompletionDate: '',
      modelRequirements: '',
      qualityStandard: 'standard'
    },
    purpose: '',
    requestedDuration: {
      startDate: '',
      endDate: ''
    },
    pricing: {
      dailyRate: 0,
      totalAmount: 0,
      securityDeposit: 0,
      currency: 'ETB'
    }
  });

  // Load data on component mount
  useEffect(() => {
    loadRentals();
    loadStats();
    loadArtifacts();
  }, []);

  // Load rentals from API
  const loadRentals = async () => {
    try {
      setLoading(true);
      const rentals = await rentalService.getAllRentals();

      // Handle both array and object responses
      const rentalsArray = Array.isArray(rentals) ? rentals : (rentals?.data || []);
      const formattedRentals = rentalsArray.map(rental =>
        rentalService.formatRentalForDisplay(rental)
      ).filter(Boolean);

      setRentalRequests(formattedRentals);
    } catch (err) {
      console.error('Load rentals error:', err);
      setError(err.message || 'Failed to load rental requests');
      setRentalRequests([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      console.log('=== LOADING MUSEUM STATS ===', new Date().toISOString());
      const statsData = await rentalService.getMuseumRentalStats();
      console.log('Received stats data:', statsData);
      setStats(statsData);
    } catch (err) {
      console.error('Load stats error:', err);
      // Set default stats on error
      setStats({ totalRequests: 0, pendingRequests: 0, approvedRequests: 0, totalRevenue: 0 });
    }
  };

  // Load artifacts from API
  const loadArtifacts = async () => {
    try {
      const artifactsData = await rentalService.getMuseumArtifacts();
      setArtifacts(artifactsData || []);
    } catch (err) {
      console.error('Load artifacts error:', err);
      setError('Failed to load artifacts');
    }
  };

  // Handle approve rental
  const handleApprove = async (id) => {
    try {
      await rentalService.approveRental(id);
      setSuccess('Rental request approved successfully');
      loadRentals();
      loadStats();
    } catch (err) {
      console.error('Approve rental error:', err);
      setError(err.message || 'Failed to approve rental request');
    }
  };

  // Handle reject rental
  const handleReject = async (id) => {
    try {
      await rentalService.rejectRental(id);
      setSuccess('Rental request rejected');
      loadRentals();
      loadStats();
    } catch (err) {
      console.error('Reject rental error:', err);
      setError(err.message || 'Failed to reject rental request');
    }
  };

  // Calculate total amount when duration or daily rate changes
  const calculateTotalAmount = () => {
    const startDate = new Date(createForm.requestedDuration.startDate);
    const endDate = new Date(createForm.requestedDuration.endDate);
    const dailyRate = parseFloat(createForm.pricing.dailyRate) || 0;

    if (startDate && endDate && dailyRate > 0) {
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end days
      const totalAmount = daysDiff * dailyRate;

      setCreateForm(prev => ({
        ...prev,
        requestedDuration: {
          ...prev.requestedDuration,
          duration: daysDiff
        },
        pricing: {
          ...prev.pricing,
          totalAmount: totalAmount
        }
      }));
    }
  };

  // Handle create new rental request (Museum to Super Admin)
  const handleCreateRental = async () => {
    try {
      // Validate required fields
      if (!createForm.artifactId || !createForm.purpose || !createForm.requestedDuration.startDate ||
        !createForm.requestedDuration.endDate || !createForm.pricing.dailyRate) {
        setError('Please fill in all required fields');
        return;
      }

      // Calculate total amount before submitting
      calculateTotalAmount();

      // Wait a bit for state to update
      setTimeout(async () => {
        try {
          const response = await rentalService.createMuseumToSuperAdminRequest(createForm);
          setSuccess('Rental request created successfully');
          setOpenCreateDialog(false);
          resetCreateForm();
          loadRentals();
          loadStats();
        } catch (err) {
          console.error('Create rental error:', err);
          setError(err.response?.data?.message || err.message || 'Failed to create rental request');
        }
      }, 100);
    } catch (err) {
      console.error('Create rental error:', err);
      setError(err.message || 'Failed to create rental request');
    }
  };

  // Handle approve 3D model
  const handleApproveModel = async (rentalId) => {
    try {
      await rentalService.approveModel(rentalId);
      setSuccess('3D model approved successfully');
      loadRentals();
    } catch (err) {
      console.error('Approve model error:', err);
      setError(err.message || 'Failed to approve 3D model');
    }
  };

  // Reset create form
  const resetCreateForm = () => {
    setCreateForm({
      artifactId: '',
      virtualMuseumDetails: {
        purpose: '3d_modeling',
        expectedCompletionDate: '',
        modelRequirements: '',
        qualityStandard: 'standard'
      },
      purpose: '',
      requestedDuration: {
        startDate: '',
        endDate: ''
      },
      pricing: {
        dailyRate: 0,
        totalAmount: 0,
        securityDeposit: 0,
        currency: 'ETB'
      }
    });
  };

  // Filter rentals based on search and filters
  const filteredRentals = rentalRequests.filter(rental => {
    const matchesSearch = rental.artifact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.renter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.organization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    const matchesDirection = directionFilter === 'all' || rental.rentalDirection === directionFilter;

    return matchesSearch && matchesStatus && matchesDirection;
  });

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get status color
  const getStatusColor = (status) => {
    return rentalService.getStatusColor(status);
  };


  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'white' }}>
      <MuseumAdminSidebar />

      <div
        className="flex-1 overflow-auto"
        onWheel={(e) => {
          // Only allow scrolling when mouse is over the main content
          e.stopPropagation();
        }}
      >
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 1, display: 'flex', alignItems: 'center', color: 'black' }}>
              <DollarSign className="mr-3" size={32} style={{ color: '#8B5A3C' }} />
              Rental Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Manage artifact rental requests and track rental agreements
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Typography variant="h4">{stats.totalRequests || 0}</Typography>
                <Typography variant="body2">Total Requests</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                <Typography variant="h4">{stats.pendingRequests || 0}</Typography>
                <Typography variant="body2">Pending</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <Typography variant="h4">{stats.approvedRequests || 0}</Typography>
                <Typography variant="body2">Approved</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={3}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                <Typography variant="h4">{(stats.totalRevenue || 0).toLocaleString()}</Typography>
                <Typography variant="body2">Revenue (ETB)</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="All Rentals" />
              <Tab label="Museum → Super Admin" />
              <Tab label="Super Admin → Museum" />
              <Tab label="Virtual Museum Ready" />
            </Tabs>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={() => setOpenCreateDialog(true)}
                sx={{
                  backgroundColor: '#8B5A3C',
                  color: 'white',
                  '&:hover': { backgroundColor: '#8B5A3C' }
                }}
              >
                Request 3D Digitization
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshCw size={20} />}
                onClick={loadRentals}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Search and Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search rentals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: 8 }} />
              }}
              sx={{ minWidth: 250 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending_review">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="model_uploaded">Model Uploaded</MenuItem>
                <MenuItem value="virtual_museum_ready">Virtual Ready</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Direction</InputLabel>
              <Select
                value={directionFilter}
                label="Direction"
                onChange={(e) => setDirectionFilter(e.target.value)}
              >
                <MenuItem value="all">All Directions</MenuItem>
                <MenuItem value="museum_to_superadmin">Museum → Super Admin</MenuItem>
                <MenuItem value="superadmin_to_museum">Super Admin → Museum</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Rental Requests Table */}
          <TableContainer component={Paper}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Artifact</TableCell>
                    <TableCell>Direction</TableCell>
                    <TableCell>Requester</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRentals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body2" color="text.secondary">
                          No rental requests found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRentals.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">{request.artifact}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.purpose}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={rentalService.getRentalDirectionLabel(request.rentalDirection)}
                            size="small"
                            variant="outlined"
                            color={request.rentalDirection === 'museum_to_superadmin' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{request.renter}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.organization}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{request.duration} days</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {request.startDate} - {request.endDate}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{request.rentalFee.toLocaleString()} {request.currency}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              +{request.securityDeposit.toLocaleString()} deposit
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={request.status.replace('_', ' ')}
                            color={getStatusColor(request.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton size="small" onClick={() => setSelectedRequest(request)}>
                                <Eye size={16} />
                              </IconButton>
                            </Tooltip>
                            {request.status === 'pending_review' && request.rentalDirection === 'superadmin_to_museum' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton size="small" color="success" onClick={() => handleApprove(request.id)}>
                                    <CheckCircle size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton size="small" color="error" onClick={() => handleReject(request.id)}>
                                    <XCircle size={16} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            {request.status === 'pending_review' && request.rentalDirection === 'museum_to_superadmin' && (
                              <Tooltip title="Waiting for Super Admin approval">
                                <IconButton size="small" disabled>
                                  <Clock size={16} />
                                </IconButton>
                              </Tooltip>
                            )}
                            {request.status === 'model_uploaded' && (
                              <Tooltip title="Approve 3D Model">
                                <IconButton size="small" color="success" onClick={() => handleApproveModel(request.id)}>
                                  <Upload size={16} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>

          {/* Request Detail Dialog */}
          <Dialog open={!!selectedRequest} onClose={() => setSelectedRequest(null)} maxWidth="md" fullWidth>
            {selectedRequest && (
              <>
                <DialogTitle>Rental Request Details</DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>Artifact Information</Typography>
                      <Typography><strong>Artifact:</strong> {selectedRequest.artifact}</Typography>
                      <Typography><strong>Purpose:</strong> {selectedRequest.purpose}</Typography>
                      <Typography><strong>Duration:</strong> {selectedRequest.duration} days</Typography>
                      <Typography><strong>Dates:</strong> {selectedRequest.startDate} - {selectedRequest.endDate}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>Financial Details</Typography>
                      <Typography><strong>Rental Fee:</strong> {selectedRequest.rentalFee.toLocaleString()} ETB</Typography>
                      <Typography><strong>Security Deposit:</strong> {selectedRequest.securityDeposit.toLocaleString()} ETB</Typography>
                      <Typography><strong>Total:</strong> {(selectedRequest.rentalFee + selectedRequest.securityDeposit).toLocaleString()} ETB</Typography>
                      <Typography><strong>Insurance:</strong> {selectedRequest.insurance}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Requester Information</Typography>
                      <Typography><strong>Organization:</strong> {selectedRequest.requester}</Typography>
                      <Typography><strong>Email:</strong> {selectedRequest.email}</Typography>
                      <Typography><strong>Request Date:</strong> {selectedRequest.requestDate}</Typography>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSelectedRequest(null)}>Close</Button>
                  {selectedRequest.status === 'pending_review' && selectedRequest.rentalDirection === 'superadmin_to_museum' && (
                    <>
                      <Button onClick={() => handleReject(selectedRequest.id)} color="error">
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApprove(selectedRequest.id)}
                        variant="contained"
                        sx={{
                          backgroundColor: '#8B5A3C',
                          color: 'white',
                          '&:hover': { backgroundColor: '#8B5A3C' }
                        }}
                      >
                        Approve
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === 'pending_review' && selectedRequest.rentalDirection === 'museum_to_superadmin' && (
                    <Typography variant="body2" color="text.secondary">
                      Waiting for Super Admin approval...
                    </Typography>
                  )}
                </DialogActions>
              </>
            )}
          </Dialog>

          {/* Create Rental Dialog */}
          <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Request 3D Digitization</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select Artifact</InputLabel>
                      <Select
                        value={createForm.artifactId}
                        onChange={(e) => setCreateForm({ ...createForm, artifactId: e.target.value })}
                        label="Select Artifact"
                      >
                        {artifacts.map((artifact) => (
                          <MenuItem key={artifact._id} value={artifact._id}>
                            {artifact.name} - {artifact.category} ({artifact.status})
                          </MenuItem>
                        ))}
                      </Select>
                      {artifacts.length === 0 && (
                        <FormHelperText>No artifacts available. Please add artifacts to your museum first.</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Purpose</InputLabel>
                      <Select
                        value={createForm.virtualMuseumDetails.purpose}
                        label="Purpose"
                        onChange={(e) => setCreateForm({
                          ...createForm,
                          virtualMuseumDetails: { ...createForm.virtualMuseumDetails, purpose: e.target.value }
                        })}
                      >
                        <MenuItem value="3d_modeling">3D Modeling</MenuItem>
                        <MenuItem value="virtual_exhibition">Virtual Exhibition</MenuItem>
                        <MenuItem value="educational_content">Educational Content</MenuItem>
                        <MenuItem value="research">Research</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Purpose Description"
                      value={createForm.purpose}
                      onChange={(e) => setCreateForm({ ...createForm, purpose: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={createForm.requestedDuration.startDate}
                      onChange={(e) => {
                        setCreateForm({
                          ...createForm,
                          requestedDuration: { ...createForm.requestedDuration, startDate: e.target.value }
                        });
                        // Trigger calculation after state update
                        setTimeout(calculateTotalAmount, 100);
                      }}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={createForm.requestedDuration.endDate}
                      onChange={(e) => {
                        setCreateForm({
                          ...createForm,
                          requestedDuration: { ...createForm.requestedDuration, endDate: e.target.value }
                        });
                        // Trigger calculation after state update
                        setTimeout(calculateTotalAmount, 100);
                      }}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Daily Rate (ETB)"
                      type="number"
                      value={createForm.pricing.dailyRate}
                      onChange={(e) => {
                        setCreateForm({
                          ...createForm,
                          pricing: { ...createForm.pricing, dailyRate: parseFloat(e.target.value) }
                        });
                        // Trigger calculation after state update
                        setTimeout(calculateTotalAmount, 100);
                      }}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Security Deposit (ETB)"
                      type="number"
                      value={createForm.pricing.securityDeposit}
                      onChange={(e) => setCreateForm({
                        ...createForm,
                        pricing: { ...createForm.pricing, securityDeposit: parseFloat(e.target.value) }
                      })}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Duration (Days)"
                      type="number"
                      value={createForm.requestedDuration.duration || ''}
                      disabled
                      helperText="Automatically calculated from start and end dates"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Total Amount (ETB)"
                      type="number"
                      value={createForm.pricing.totalAmount || ''}
                      disabled
                      helperText="Automatically calculated from duration × daily rate"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Model Requirements"
                      value={createForm.virtualMuseumDetails.modelRequirements}
                      onChange={(e) => setCreateForm({
                        ...createForm,
                        virtualMuseumDetails: { ...createForm.virtualMuseumDetails, modelRequirements: e.target.value }
                      })}
                      placeholder="Specify any special requirements for the 3D model..."
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
              <Button
                onClick={handleCreateRental}
                variant="contained"
                sx={{ backgroundColor: '#8B4513', '&:hover': { backgroundColor: '#A0522D' } }}
              >
                Create Request
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>

          <Snackbar
            open={!!success}
            autoHideDuration={6000}
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </div>
  );
};

export default RentalManagement;
