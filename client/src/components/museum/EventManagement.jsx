import React, { useState, useEffect } from 'react';
import MuseumAdminSidebar from '../dashboard/MuseumAdminSidebar';
import {
  Box, Typography, Container, Grid, Paper, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Card, CardContent,
  CardActions, Avatar, Badge, Tabs, Tab, Alert, Snackbar, CircularProgress
} from '@mui/material';
import {
  Calendar,
  Plus,
  Eye,
  Edit,
  Delete,
  RefreshCw,
  Clock,
  MapPin,
  Users,
  Trophy,
  Settings,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
} from 'lucide-react';
import eventService from '../../services/eventService';

const EventManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0
  });
  const [eventTypes, setEventTypes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Load initial data
  useEffect(() => {
    loadEvents();
    loadStats();
    loadEventTypesAndCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const events = await eventService.getAllEvents();
      setEvents(events || []);
    } catch (err) {
      console.error('Load events error:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const stats = await eventService.getEventStats();
      setStats(stats || {
        totalEvents: 0,
        activeEvents: 0,
        totalRegistrations: 0
      });
    } catch (err) {
      console.error('Load stats error:', err);
    }
  };

  const loadEventTypesAndCategories = async () => {
    try {
      const response = await eventService.getEventTypesAndCategories();
      setEventTypes(response.types || []);
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Load types and categories error:', err);
      // Fallback data
      setEventTypes(['exhibition', 'workshop', 'lecture', 'tour', 'conference', 'cultural_event', 'educational_program', 'special_exhibition', 'community_event', 'virtual_event', 'other']);
      setCategories(['art', 'history', 'culture', 'archaeology', 'science', 'education', 'entertainment', 'community', 'research', 'preservation']);
    }
  };
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'Exhibition',
    date: '',
    endDate: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    ticketPrice: '',
    category: 'Educational'
  });

  const statusColors = {
    'draft': 'default',
    'published': 'success',
    'upcoming': 'info',
    'active': 'success',
    'ongoing': 'success',
    'completed': 'default',
    'cancelled': 'error',
    'archived': 'default'
  };

  const handleCreateEvent = async () => {
    try {
      const eventData = eventService.formatEventData({
        ...newEvent,
        startDate: newEvent.date,
        endDate: newEvent.endDate,
        startTime: newEvent.time?.split('-')[0]?.trim(),
        endTime: newEvent.time?.split('-')[1]?.trim(),
        locationType: 'physical',
        venue: newEvent.location,
        registrationRequired: true,
        capacity: newEvent.capacity,
        adultFee: newEvent.ticketPrice,
        currency: 'ETB'
      });

      const response = await eventService.createEvent(eventData);
      console.log('Created event response:', response);
      setEvents([response, ...events]);
      setOpenCreateDialog(false);
      setSuccess('Event created successfully!');

      // Refresh the events list to ensure we have the latest data
      await loadEvents();
      setNewEvent({
        title: '',
        type: 'exhibition',
        date: '',
        endDate: '',
        time: '',
        location: '',
        capacity: '',
        description: '',
        ticketPrice: '',
        category: 'education'
      });
      setSuccess('Event created successfully');
      loadStats(); // Refresh stats
    } catch (err) {
      console.error('Create event error:', err);
      setError(err.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (id, eventData) => {
    try {
      const response = await eventService.updateEvent(id, eventData);
      setEvents(events.map(event =>
        event._id === id ? response.data : event
      ));
      setOpenEditDialog(false);
      setEditingEvent(null);
      setSuccess('Event updated successfully');
      loadStats(); // Refresh stats
    } catch (err) {
      console.error('Update event error:', err);
      setError(err.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await eventService.deleteEvent(id);
      setEvents(events.filter(event => event._id !== id));
      setSuccess('Event deleted successfully');
      loadStats(); // Refresh stats
    } catch (err) {
      console.error('Delete event error:', err);
      setError(err.message || 'Failed to delete event');
    }
  };

  const renderEventsList = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }

    if (events.length === 0) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first event to get started
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => {
              const displayEvent = eventService.formatEventForDisplay(event);
              if (!displayEvent) {
                return null; // Skip invalid events
              }
              return (
                <TableRow key={event._id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{displayEvent.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {displayEvent.category} • {displayEvent.ticketPrice} ETB
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={displayEvent.type} color="primary" size="small" />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{displayEvent.date}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {displayEvent.time}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{displayEvent.location}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {displayEvent.registrations}/{displayEvent.capacity}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {displayEvent.capacity > 0 ? Math.round((displayEvent.registrations / displayEvent.capacity) * 100) : 0}% full
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={displayEvent.status}
                      color={statusColors[displayEvent.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => setSelectedEvent(event)}>
                      <Eye size={16} />
                    </IconButton>
                    <IconButton size="small" onClick={() => {
                      setEditingEvent(event);
                      setOpenEditDialog(true);
                    }}>
                      <Edit size={16} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteEvent(event._id)}>
                      <Delete size={16} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MuseumAdminSidebar />

      <div className="flex-1 overflow-auto">
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <Calendar className="mr-3" size={32} />
              Event Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create and manage museum events, exhibitions, and educational programs
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', color: 'white' }}>
                <Typography variant="h4">{stats.totalEvents || 0}</Typography>
                <Typography variant="body2">Total Events</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 100%)', color: 'white' }}>
                <Typography variant="h4">{stats.activeEvents || 0}</Typography>
                <Typography variant="body2">Active Events</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #8B4513 0%, #CD853F 100%)', color: 'white' }}>
                <Typography variant="h4">{stats.totalRegistrations || 0}</Typography>
                <Typography variant="body2">Total Registrations</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Events & Exhibitions</Typography>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshCw size={16} />}
                  onClick={loadEvents}
                  disabled={loading}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Plus size={16} />}
                  onClick={() => setOpenCreateDialog(true)}
                >
                  Create New Event
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Events List */}
          {renderEventsList()}

          {/* Create Event Dialog */}
          <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="md" fullWidth>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={newEvent.type}
                      label="Type"
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    >
                      {eventTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={newEvent.category}
                      label="Category"
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Time"
                    placeholder="e.g., 09:00-17:00"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ticket Price (ETB)"
                    type="number"
                    value={newEvent.ticketPrice}
                    onChange={(e) => setNewEvent({ ...newEvent, ticketPrice: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenCreateDialog(false)} startIcon={<X size={16} />}>Cancel</Button>
              <Button onClick={handleCreateEvent} variant="contained">Create Event</Button>
            </DialogActions>
          </Dialog>

          {/* Event Detail Dialog */}
          <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} maxWidth="md" fullWidth>
            {selectedEvent && (() => {
              const displayEvent = eventService.formatEventForDisplay(selectedEvent);
              return (
                <>
                  <DialogTitle>{displayEvent.title}</DialogTitle>
                  <DialogContent>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Event Details</Typography>
                        <Typography><strong>Type:</strong> {displayEvent.type}</Typography>
                        <Typography><strong>Category:</strong> {displayEvent.category}</Typography>
                        <Typography><strong>Date:</strong> {displayEvent.date} - {displayEvent.endDate}</Typography>
                        <Typography><strong>Time:</strong> {displayEvent.time}</Typography>
                        <Typography><strong>Location:</strong> {displayEvent.location}</Typography>
                        <Typography><strong>Price:</strong> {displayEvent.ticketPrice} ETB</Typography>
                        <Typography><strong>Status:</strong> {displayEvent.status}</Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Registration Stats</Typography>
                        <Typography><strong>Capacity:</strong> {displayEvent.capacity}</Typography>
                        <Typography><strong>Registered:</strong> {displayEvent.registrations}</Typography>
                        <Typography><strong>Available:</strong> {displayEvent.capacity - displayEvent.registrations}</Typography>
                        <Typography><strong>Occupancy:</strong> {displayEvent.capacity > 0 ? Math.round((displayEvent.registrations / displayEvent.capacity) * 100) : 0}%</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>Description</Typography>
                        <Typography>{selectedEvent.description}</Typography>
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSelectedEvent(null)}>Close</Button>
                    <Button variant="contained" onClick={() => {
                      setEditingEvent(selectedEvent);
                      setOpenEditDialog(true);
                      setSelectedEvent(null);
                    }}>Edit Event</Button>
                  </DialogActions>
                </>
              );
            })()}
          </Dialog>

          {/* Edit Event Dialog */}
          <Dialog open={openEditDialog} onClose={() => {
            setOpenEditDialog(false);
            setEditingEvent(null);
          }} maxWidth="md" fullWidth>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogContent>
              {editingEvent && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Event Title"
                      value={editingEvent.title || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={editingEvent.type || ''}
                        label="Type"
                        onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                      >
                        {eventTypes.map((type) => (
                          <MenuItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={editingEvent.category || ''}
                        label="Category"
                        onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={editingEvent.schedule?.startDate ? new Date(editingEvent.schedule.startDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        schedule: {
                          ...editingEvent.schedule,
                          startDate: e.target.value
                        }
                      })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      value={editingEvent.schedule?.endDate ? new Date(editingEvent.schedule.endDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        schedule: {
                          ...editingEvent.schedule,
                          endDate: e.target.value
                        }
                      })}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      placeholder="e.g., 09:00"
                      value={editingEvent.schedule?.startTime || ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        schedule: {
                          ...editingEvent.schedule,
                          startTime: e.target.value
                        }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="End Time"
                      placeholder="e.g., 17:00"
                      value={editingEvent.schedule?.endTime || ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        schedule: {
                          ...editingEvent.schedule,
                          endTime: e.target.value
                        }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={editingEvent.location?.venue || ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        location: {
                          ...editingEvent.location,
                          venue: e.target.value
                        }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Capacity"
                      type="number"
                      value={editingEvent.registration?.capacity || ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        registration: {
                          ...editingEvent.registration,
                          capacity: e.target.value
                        }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ticket Price (ETB)"
                      type="number"
                      value={editingEvent.registration?.fees?.adult || ''}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        registration: {
                          ...editingEvent.registration,
                          fees: {
                            ...editingEvent.registration?.fees,
                            adult: e.target.value
                          }
                        }
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={editingEvent.status || 'draft'}
                        label="Status"
                        onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
                      >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="published">Published</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={editingEvent.description || ''}
                      onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                    />
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setOpenEditDialog(false);
                setEditingEvent(null);
              }} startIcon={<X size={16} />}>Cancel</Button>
              <Button onClick={() => editingEvent && handleUpdateEvent(editingEvent._id, editingEvent)} variant="contained" disabled={!editingEvent}>Update Event</Button>
            </DialogActions>
          </Dialog>

          {/* Error/Success Snackbars */}
          <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error">
              {error}
            </Alert>
          </Snackbar>
          <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
            <Alert onClose={() => setSuccess(null)} severity="success">
              {success}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </div>
  );
};

export default EventManagement;
