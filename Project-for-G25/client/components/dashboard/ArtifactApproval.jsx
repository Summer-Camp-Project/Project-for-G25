import { useState } from 'react';
import {
  Box, Button, Card, CardContent, CardMedia, Chip, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, Grid, IconButton, LinearProgress,
  MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField, Typography, useTheme,
  Avatar, FormControl, InputLabel, Snackbar, Alert, Tooltip
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterListIcon, CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon, Delete as DeleteIcon, Edit as EditIcon, Visibility as VisibilityIcon,
  Refresh as RefreshIcon, Image as ImageIcon, Category as CategoryIcon,
  CalendarToday as CalendarIcon, Person as PersonIcon, Museum as MuseumIcon
} from '@mui/icons-material';

const ArtifactApproval = ({ artifacts, onApprove, onReject, loading = false }) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle artifact actions
  const handleViewArtifact = (artifact) => {
    setSelectedArtifact(artifact);
    setViewDialogOpen(true);
  };

  const handleApprove = async (artifactId) => {
    try {
      await onApprove(artifactId);
      setSnackbar({ open: true, message: 'Artifact approved!', severity: 'success' });
      setViewDialogOpen(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Approval failed', severity: 'error' });
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setSnackbar({ open: true, message: 'Please provide a reason', severity: 'warning' });
      return;
    }
    try {
      await onReject(selectedArtifact.id, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason('');
      setViewDialogOpen(false);
      setSnackbar({ open: true, message: 'Artifact rejected', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Rejection failed', severity: 'error' });
    }
  };

  // Filter and paginate artifacts
  const filteredArtifacts = artifacts
    .filter(artifact => {
      const matchesSearch = 
        artifact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artifact.submittedBy?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || artifact.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const paginatedArtifacts = filteredArtifacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Status options and helpers
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const getStatusColor = (status) => ({
    approved: 'success',
    rejected: 'error',
    pending: 'warning'
  }[status] || 'default');

  return (
    <>
      <Card elevation={0}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Artifact Management
              {filteredArtifacts.length > 0 && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  ({filteredArtifacts.length} artifacts)
                </Typography>
              )}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          
          {/* Filters */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Artifact</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Submitted By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedArtifacts.length > 0 ? (
                    paginatedArtifacts.map((artifact) => (
                      <TableRow key={artifact.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {artifact.images?.[0] ? (
                              <Box 
                                component="img"
                                src={artifact.images[0]}
                                alt={artifact.name}
                                sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1, mr: 2 }}
                              />
                            ) : (
                              <Box sx={{ width: 50, height: 50, bgcolor: 'action.hover', borderRadius: 1, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon color="disabled" />
                              </Box>
                            )}
                            <Typography variant="subtitle2">
                              {artifact.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                            {artifact.description || 'No description'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar src={artifact.submitterAvatar} sx={{ width: 30, height: 30, mr: 1 }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2">
                              {artifact.submittedBy || 'Unknown'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={artifact.status || 'pending'}
                            color={getStatusColor(artifact.status)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(artifact.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton size="small" onClick={() => handleViewArtifact(artifact)}>
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {artifact.status === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton size="small" color="success" onClick={() => handleApprove(artifact.id)}>
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton size="small" color="error" onClick={() => {
                                    setSelectedArtifact(artifact);
                                    setRejectDialogOpen(true);
                                  }}>
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <ImageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography>No artifacts found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredArtifacts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </Box>
      </Card>

      {/* View Artifact Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedArtifact && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedArtifact.name}
                <Chip 
                  label={selectedArtifact.status}
                  color={getStatusColor(selectedArtifact.status)}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {selectedArtifact.images?.[0] ? (
                    <Box sx={{ width: '100%', height: 300, position: 'relative' }}>
                      <Box
                        component="img"
                        src={selectedArtifact.images[0]}
                        alt={selectedArtifact.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ 
                      width: '100%', 
                      height: 300, 
                      bgcolor: 'action.hover',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1
                    }}>
                      <ImageIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Details</Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography paragraph>{selectedArtifact.description || 'No description'}</Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Submitted By</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Avatar src={selectedArtifact.submitterAvatar} sx={{ width: 32, height: 32, mr: 1 }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography>{selectedArtifact.submittedBy || 'Unknown'}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                      <Typography>{new Date(selectedArtifact.createdAt).toLocaleDateString()}</Typography>
                    </Grid>
                    {selectedArtifact.category && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                        <Typography>{selectedArtifact.category}</Typography>
                      </Grid>
                    )}
                    {selectedArtifact.museum && (
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Museum</Typography>
                        <Typography>{selectedArtifact.museum}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
              {selectedArtifact.status === 'pending' && (
                <>
                  <Button 
                    color="error"
                    onClick={() => {
                      setViewDialogOpen(false);
                      setRejectDialogOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => handleApprove(selectedArtifact.id)}
                  >
                    Approve
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Artifact</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to reject this artifact? Please provide a reason.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleReject} 
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ArtifactApproval;
