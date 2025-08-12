
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
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
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterFlagged, setFilterFlagged] = useState('all');
  const [selectedArtifacts, setSelectedArtifacts] = useState([]);
  const [bulkAction, setBulkAction] = useState('approve');
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [forceRemoveDialogOpen, setForceRemoveDialogOpen] = useState(false);
  const [forceRemoveReason, setForceRemoveReason] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [flagDialogOpen, setFlagDialogOpen] = useState(false);
  const [flagReason, setFlagReason] = useState('');
  const [flagCategory, setFlagCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [bulkRejectReason, setBulkRejectReason] = useState('');
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
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        artifact.name?.toLowerCase().includes(searchLower) ||
        artifact.description?.toLowerCase().includes(searchLower) ||
        artifact.submittedBy?.toLowerCase().includes(searchLower) ||
        (artifact.tags || []).some(tag => 
          tag.toLowerCase().includes(searchLower)
        );
      
      const matchesStatus = 
        filterStatus === 'all' || 
        artifact.status === filterStatus ||
        (filterStatus === 'flagged' && artifact.flagged);
      
      const matchesFlagFilter = 
        filterFlagged === 'all' ||
        (filterFlagged === 'flagged' ? artifact.flagged : !artifact.flagged);
      
      return matchesSearch && matchesStatus && matchesFlagFilter;
    })
    .sort((a, b) => {
      // Sort flagged items to the top, then by creation date
      if (a.flagged !== b.flagged) {
        return a.flagged ? -1 : 1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const paginatedArtifacts = filteredArtifacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Status and filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'flagged', label: 'Flagged for Review' },
  ];

  const flagFilterOptions = [
    { value: 'all', label: 'All' },
    { value: 'flagged', label: 'Flagged' },
    { value: 'not_flagged', label: 'Not Flagged' },
  ];

  const flagCategories = [
    { value: 'inappropriate', label: 'Inappropriate Content' },
    { value: 'copyright', label: 'Copyright Violation' },
    { value: 'inaccurate', label: 'Inaccurate Information' },
    { value: 'duplicate', label: 'Duplicate' },
    { value: 'other', label: 'Other' },
  ];

  // Get color for status badge
  const getStatusColor = (status) => {
    const statusColors = {
      approved: 'success',
      rejected: 'error',
      pending: 'warning',
      flagged: 'secondary',
    };
    return statusColors[status] || 'default';
  };

  // Handle flag artifact
  const handleFlagArtifact = async (artifactId, reason, category) => {
    try {
      // In a real app, you would call your API here
      console.log(`Flagging artifact ${artifactId} with reason: ${reason}, category: ${category}`);
      
      // Update local state
      setArtifacts(artifacts.map(art => 
        art.id === artifactId 
          ? { 
              ...art, 
              flagged: true,
              flagReason: reason,
              flagCategory: category,
              flagDate: new Date().toISOString()
            } 
          : art
      ));
      
      // Add to audit log
      const artifact = artifacts.find(a => a.id === artifactId);
      addToAuditLog({
        action: 'ARTIFACT_FLAGGED',
        targetId: artifactId,
        targetType: 'artifact',
        targetName: artifact?.name || `Artifact ${artifactId}`,
        details: { reason, category },
        timestamp: new Date().toISOString()
      });
      
      setFlagDialogOpen(false);
      setFlagReason('');
      setFlagCategory('');
      
      enqueueSnackbar('Artifact flagged for review', { variant: 'warning' });
    } catch (error) {
      console.error('Error flagging artifact:', error);
      enqueueSnackbar('Failed to flag artifact', { variant: 'error' });
    }
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    try {
      if (!bulkAction || selectedArtifacts.length === 0) return;
      
      // In a real app, you would call your API here
      console.log(`Performing ${bulkAction} on artifacts:`, selectedArtifacts);
      
      // Update local state based on bulk action
      const updatedArtifacts = artifacts.map(art => {
        if (selectedArtifacts.includes(art.id)) {
          switch (bulkAction) {
            case 'approve':
              return { ...art, status: 'approved', flagged: false };
            case 'reject':
              return { 
                ...art, 
                status: 'rejected',
                rejectedReason: bulkRejectReason || 'No reason provided'
              };
            case 'flag':
              return { 
                ...art, 
                flagged: true,
                flagReason: 'Bulk flagged by moderator',
                flagCategory: 'other',
                flagDate: new Date().toISOString()
              };
            default:
              return art;
          }
        }
        return art;
      });
      
      setArtifacts(updatedArtifacts);
      
      // Add to audit log
      selectedArtifacts.forEach(artifactId => {
        const artifact = artifacts.find(a => a.id === artifactId);
        if (artifact) {
          addToAuditLog({
            action: `ARTIFACT_${bulkAction.toUpperCase()}`,
            targetId: artifactId,
            targetType: 'artifact',
            targetName: artifact?.name || `Artifact ${artifactId}`,
            details: bulkAction === 'reject' ? { reason: bulkRejectReason } : {},
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Reset state
      setSelectedArtifacts([]);
      setBulkDialogOpen(false);
      setBulkAction('');
      setBulkRejectReason('');
      
      enqueueSnackbar(`Successfully ${bulkAction}ed ${selectedArtifacts.length} artifacts`, { 
        variant: 'success' 
      });
    } catch (error) {
      console.error(`Error performing bulk ${bulkAction}:`, error);
      enqueueSnackbar(`Failed to ${bulkAction} artifacts`, { variant: 'error' });
    }
  };
  
  // Add to audit log
  const addToAuditLog = (entry) => {
    setAuditLogs(prev => [entry, ...prev].slice(0, 100)); // Keep last 100 entries
  };

  // Render flag dialog
  const renderFlagDialog = () => (
    <Dialog 
      open={flagDialogOpen} 
      onClose={() => setFlagDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {selectedArtifact?.flagged ? 'Flag Details' : 'Flag Artifact for Review'}
      </DialogTitle>
      <DialogContent>
        {selectedArtifact?.flagged ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              This artifact has been flagged for the following reason:
            </Typography>
            <Box sx={{ 
              bgcolor: 'background.paper', 
              p: 2, 
              borderRadius: 1,
              mb: 2
            }}>
              <Typography variant="subtitle2" color="text.secondary">
                Category:
              </Typography>
              <Typography variant="body1" gutterBottom>
                {flagCategories.find(c => c.value === selectedArtifact.flagCategory)?.label || 'Other'}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Reason:
              </Typography>
              <Typography variant="body1">
                {selectedArtifact.flagReason || 'No reason provided'}
              </Typography>
              
              <Typography variant="caption" color="text.secondary" display="block" mt={2}>
                Flagged on: {new Date(selectedArtifact.flagDate).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={flagCategory}
                onChange={(e) => setFlagCategory(e.target.value)}
                label="Category"
              >
                {flagCategories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for flagging"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              placeholder="Please provide details about why this artifact should be reviewed..."
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          setFlagDialogOpen(false);
          setFlagReason('');
          setFlagCategory('');
        }}>
          {selectedArtifact?.flagged ? 'Close' : 'Cancel'}
        </Button>
        {!selectedArtifact?.flagged && (
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => {
              if (selectedArtifact && flagCategory) {
                handleFlagArtifact(
                  selectedArtifact.id, 
                  flagReason || 'No reason provided',
                  flagCategory
                );
              }
            }}
            disabled={!flagCategory}
          >
            Flag for Review
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  // Render bulk action dialog
  const renderBulkActionDialog = () => (
    <Dialog 
      open={bulkDialogOpen} 
      onClose={() => {
        setBulkDialogOpen(false);
        setBulkRejectReason('');
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {bulkAction === 'approve' && 'Approve Selected Artifacts'}
        {bulkAction === 'reject' && 'Reject Selected Artifacts'}
        {bulkAction === 'flag' && 'Flag Selected Artifacts'}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          You are about to {bulkAction} <strong>{selectedArtifacts.length}</strong> artifact{selectedArtifacts.length !== 1 ? 's' : ''}.
        </Typography>
        
        {bulkAction === 'reject' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for rejection"
            value={bulkRejectReason}
            onChange={(e) => setBulkRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejecting these artifacts..."
            sx={{ mt: 2 }}
          />
        )}
        
        {bulkAction === 'flag' && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={flagCategory}
              onChange={(e) => setFlagCategory(e.target.value)}
              label="Category"
            >
              {flagCategories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => {
            setBulkDialogOpen(false);
            setBulkRejectReason('');
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color={
            bulkAction === 'approve' ? 'success' : 
            bulkAction === 'reject' ? 'error' : 'warning'
          }
          onClick={handleBulkAction}
          disabled={
            (bulkAction === 'reject' && !bulkRejectReason.trim()) ||
            (bulkAction === 'flag' && !flagCategory)
          }
        >
          {bulkAction === 'approve' && 'Approve All'}
          {bulkAction === 'reject' && 'Reject All'}
          {bulkAction === 'flag' && 'Flag All'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Render audit logs section
  const renderAuditLogs = () => (
    <Collapse in={showAuditLogs}>
      <Box sx={{ mt: 3 }}>
        <Card variant="outlined">
          <CardHeader 
            title="Audit Logs" 
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <IconButton onClick={() => setShowAuditLogs(false)}>
                <CloseIcon />
              </IconButton>
            }
          />
          <Divider />
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            {auditLogs.length > 0 ? (
              <List>
                {auditLogs.map((log, index) => (
                  <React.Fragment key={index}>
                    <ListItem 
                      alignItems="flex-start"
                      secondaryAction={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'action.active' }}>
                          {log.action === 'ARTIFACT_APPROVED' ? (
                            <CheckCircleIcon color="success" />
                          ) : log.action === 'ARTIFACT_REJECTED' ? (
                            <CancelIcon color="error" />
                          ) : log.action === 'ARTIFACT_FLAGGED' ? (
                            <FlagIcon color="warning" />
                          ) : (
                            <InfoIcon />
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <Typography component="span" variant="subtitle2">
                              {log.targetName}
                            </Typography>
                            <Chip 
                              label={log.action.replace('ARTIFACT_', '').toLowerCase()}
                              size="small"
                              sx={{ ml: 1, height: 20, fontSize: '0.65rem' }}
                              color={
                                log.action === 'ARTIFACT_APPROVED' ? 'success' :
                                log.action === 'ARTIFACT_REJECTED' ? 'error' :
                                log.action === 'ARTIFACT_FLAGGED' ? 'warning' : 'default'
                              }
                              variant="outlined"
                            />
                          </>
                        }
                        secondary={
                          log.details?.reason || 
                          (log.action === 'ARTIFACT_APPROVED' ? 'Artifact was approved' : 'No details')
                        }
                        secondaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                    {index < auditLogs.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No audit logs available
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Collapse>
  );

  return (
    <>
      {renderFlagDialog()}
      {renderBulkActionDialog()}
      {renderAuditLogs()}
      
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<FlagIcon />}
                onClick={() => setShowAuditLogs(!showAuditLogs)}
                disabled={loading}
              >
                {showAuditLogs ? 'Hide Logs' : 'View Logs'}
              </Button>
            </Box>
          </Box>
          
          {/* Filters and Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {/* Search and Filters Row */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                sx={{ minWidth: 250, flex: 1, maxWidth: 400 }}
              />
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={`status-${option.value}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Flag Status</InputLabel>
                <Select
                  value={filterFlagged}
                  onChange={(e) => setFilterFlagged(e.target.value)}
                  label="Flag Status"
                >
                  {flagFilterOptions.map((option) => (
                    <MenuItem key={`flag-${option.value}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                  setFilterFlagged('all');
                  setPage(0);
                }}
                sx={{ ml: 'auto' }}
              >
                Reset Filters
              </Button>
            </Box>
            
            {/* Bulk Actions Row */}
            {selectedArtifacts.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                p: 1,
                bgcolor: 'action.hover',
                borderRadius: 1
              }}>
                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                  {selectedArtifacts.length} selected
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => {
                    setBulkAction('approve');
                    setBulkDialogOpen(true);
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setBulkAction('reject');
                    setBulkDialogOpen(true);
                  }}
                >
                  Reject
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<FlagIcon />}
                  onClick={() => {
                    setBulkAction('flag');
                    setBulkDialogOpen(true);
                  }}
                >
                  Flag
                </Button>
                <Button
                  size="small"
                  color="inherit"
                  onClick={() => setSelectedArtifacts([])}
                  sx={{ ml: 'auto' }}
                >
                  Clear Selection
                </Button>
              </Box>
            )}
          </Box>

          {loading ? (
            <LinearProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedArtifacts.length > 0 && 
                          selectedArtifacts.length < filteredArtifacts.length
                        }
                        checked={
                          filteredArtifacts.length > 0 && 
                          selectedArtifacts.length === filteredArtifacts.length
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedArtifacts(filteredArtifacts.map(art => art.id));
                          } else {
                            setSelectedArtifacts([]);
                          }
                        }}
                        inputProps={{ 'aria-label': 'select all artifacts' }}
                      />
                    </TableCell>
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
                    paginatedArtifacts.map((artifact) => {
                      const isSelected = selectedArtifacts.includes(artifact.id);
                      return (
                        <TableRow 
                          key={artifact.id} 
                          hover 
                          selected={isSelected}
                          onClick={(e) => {
                            // Don't trigger selection if clicking on a button or link
                            if (e.target.closest('button, a, [role="button"]')) return;
                            
                            setSelectedArtifacts(prev => 
                              prev.includes(artifact.id)
                                ? prev.filter(id => id !== artifact.id)
                                : [...prev, artifact.id]
                            );
                          }}
                          sx={{ 
                            cursor: 'pointer',
                            bgcolor: artifact.flagged ? 'rgba(245, 0, 87, 0.04)' : 'inherit',
                            '&:hover': {
                              bgcolor: artifact.flagged 
                                ? 'rgba(245, 0, 87, 0.08)' 
                                : 'action.hover'
                            }
                          }}
                        >
                          <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                setSelectedArtifacts(prev => 
                                  prev.includes(artifact.id)
                                    ? prev.filter(id => id !== artifact.id)
                                    : [...prev, artifact.id]
                                );
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ position: 'relative', mr: 2 }}>
                                {artifact.images?.[0] ? (
                                  <Box 
                                    component="img"
                                    src={artifact.images[0]}
                                    alt={artifact.name}
                                    sx={{ 
                                      width: 50, 
                                      height: 50, 
                                      objectFit: 'cover', 
                                      borderRadius: 1,
                                      opacity: artifact.status === 'rejected' ? 0.5 : 1,
                                      filter: artifact.status === 'rejected' ? 'grayscale(80%)' : 'none'
                                    }}
                                  />
                                ) : (
                                  <Box sx={{ 
                                    width: 50, 
                                    height: 50, 
                                    bgcolor: 'action.hover', 
                                    borderRadius: 1, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                  }}>
                                    <ImageIcon color="disabled" />
                                  </Box>
                                )}
                                {artifact.flagged && (
                                  <Box 
                                    sx={{
                                      position: 'absolute',
                                      top: -8,
                                      right: -8,
                                      bgcolor: 'warning.main',
                                      color: 'warning.contrastText',
                                      borderRadius: '50%',
                                      width: 20,
                                      height: 20,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: 1
                                    }}
                                  >
                                    <FlagIcon sx={{ fontSize: 14 }} />
                                  </Box>
                                )}
                              </Box>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="subtitle2">
                                    {artifact.name}
                                  </Typography>
                                  {artifact.flagged && (
                                    <Tooltip title="Flagged for review">
                                      <Chip 
                                        size="small" 
                                        label="Flagged" 
                                        color="warning" 
                                        variant="outlined"
                                        sx={{ height: 20, fontSize: '0.7rem' }}
                                      />
                                    </Tooltip>
                                  )}
                                </Box>
                                {artifact.flagReason && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {artifact.flagReason}
                                  </Typography>
                                )}
                              </Box>
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
                              color={getStatusColor(artifact.status || 'pending')}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            {new Date(artifact.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(artifact.createdAt).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="Preview">
                                <IconButton 
                                  size="small" 
                                  color="primary" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(artifact);
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Approve">
                                <IconButton 
                                  size="small" 
                                  color="success" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(artifact.id);
                                  }}
                                  disabled={artifact.status === 'approved'}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton 
                                  size="small" 
                                  color="error" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(artifact.id);
                                  }}
                                  disabled={artifact.status === 'rejected'}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={artifact.flagged ? 'View Flag Details' : 'Flag for Review'}>
                                <IconButton
                                  size="small"
                                  color={artifact.flagged ? 'warning' : 'default'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedArtifact(artifact);
                                    setFlagDialogOpen(true);
                                  }}
                                >
                                  <FlagIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
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

