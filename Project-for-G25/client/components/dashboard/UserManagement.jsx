import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Snackbar,
  Badge,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  PersonOff as PersonOffIcon,
  PersonAddDisabled as PersonAddDisabledIcon,
  Visibility as VisibilityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

const UserManagement = ({ users, onApprove, onReject, onRefresh, loading = false }) => {
  const theme = useTheme();
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // State for filtering and sorting
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  
  // State for dialogs
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle change page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle change rows per page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  // Handle approve user
  const handleApprove = async (userId) => {
    try {
      await onApprove(userId);
      setSnackbar({
        open: true,
        message: 'User approved successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to approve user. Please try again.',
        severity: 'error',
      });
    }
  };

  // Handle reject user
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a reason for rejection.',
        severity: 'warning',
      });
      return;
    }

    try {
      await onReject(selectedUser.id, rejectReason);
      setRejectDialogOpen(false);
      setRejectReason('');
      setSnackbar({
        open: true,
        message: 'User rejected successfully.',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to reject user. Please try again.',
        severity: 'error',
      });
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (a[orderBy] > b[orderBy]) {
        comparison = 1;
      } else if (a[orderBy] < b[orderBy]) {
        comparison = -1;
      }
      return order === 'desc' ? -comparison : comparison;
    });

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon fontSize="small" />;
      case 'rejected':
        return <CancelIcon fontSize="small" />;
      case 'pending':
        return <PersonAddDisabledIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Card elevation={0}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="div">
              User Management
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                sx={{ mr: 1 }}
              >
                Add User
              </Button>
              <Tooltip title="Refresh">
                <IconButton onClick={onRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Filters and Search */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search users..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
                startAdornment={
                  <FilterListIcon sx={{ color: 'text.secondary', mr: 1 }} />
                }
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Users Table */}
          <Paper variant="outlined">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ) : paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              src={user.avatar} 
                              alt={user.name}
                              sx={{ width: 36, height: 36, mr: 2 }}
                            >
                              {user.name?.charAt(0) || <PersonIcon />}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">{user.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                @{user.username || 'user' + user.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role || 'User'} 
                            size="small" 
                            variant="outlined"
                            color={user.role === 'admin' ? 'primary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status || 'pending'} 
                            size="small"
                            color={getStatusColor(user.status)}
                            icon={getStatusIcon(user.status)}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Tooltip title="View Details">
                              <IconButton 
                                size="small" 
                                onClick={() => handleViewUser(user)}
                                color="info"
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            {user.status === 'pending' && (
                              <>
                                <Tooltip title="Approve">
                                  <IconButton 
                                    size="small" 
                                    color="success"
                                    onClick={() => handleApprove(user.id)}
                                  >
                                    <CheckCircleIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                  <IconButton 
                                    size="small" 
                                    color="error"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setRejectDialogOpen(true);
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                            
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <PersonOffIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                          <Typography variant="subtitle1" color="text.secondary">
                            No users found
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your search or filter criteria
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </Card>

      {/* User Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  src={selectedUser.avatar} 
                  alt={selectedUser.name}
                  sx={{ width: 80, height: 80, mr: 3 }}
                >
                  {selectedUser.name?.charAt(0) || <PersonIcon />}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedUser.email}
                  </Typography>
                  <Chip 
                    label={selectedUser.role || 'User'} 
                    size="small" 
                    color={selectedUser.role === 'admin' ? 'primary' : 'default'}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">{selectedUser.email}</Typography>
                  </Box>
                  {selectedUser.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{selectedUser.phone}</Typography>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {selectedUser.address && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <LocationIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                      <Typography variant="body2">{selectedUser.address}</Typography>
                    </Box>
                  )}
                  {selectedUser.organization && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon color="action" sx={{ mr: 1 }} />
                      <Typography variant="body2">{selectedUser.organization}</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
              
              {selectedUser.bio && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Bio</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedUser.bio}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Account Status</Typography>
                  <Chip 
                    label={selectedUser.status || 'pending'} 
                    color={getStatusColor(selectedUser.status)}
                    icon={getStatusIcon(selectedUser.status)}
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Joined on {new Date(selectedUser.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          {selectedUser?.status === 'pending' && (
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
                onClick={() => {
                  handleApprove(selectedUser.id);
                  setViewDialogOpen(false);
                }}
              >
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Reject User Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject User Request</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to reject {selectedUser?.name || 'this user'}'s request?
            Please provide a reason for rejection.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reject-reason"
            label="Reason for rejection"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRejectDialogOpen(false);
            setRejectReason('');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleReject} 
            color="error"
            variant="contained"
            disabled={!rejectReason.trim()}
          >
            Reject User
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default UserManagement;
