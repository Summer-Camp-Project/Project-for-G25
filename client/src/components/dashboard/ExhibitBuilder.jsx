
import React, { useState } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, TextField, Typography,
  Paper, IconButton, Snackbar, Alert, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, useTheme, Divider,
  FormControl, InputLabel, Select, MenuItem, Chip, Avatar, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon,
  Cancel as CancelIcon, PhotoLibrary as PhotoLibraryIcon, Visibility as VisibilityIcon
} from '@mui/icons-material';

const ExhibitBuilder = () => {
  const theme = useTheme();
  
  // Exhibit state
  const [exhibit, setExhibit] = useState({
    title: '',
    description: '',
    isPublished: false,
    sections: []
  });
  
  // UI state
  const [activeSection, setActiveSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedArtifacts, setSelectedArtifacts] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data for artifacts
  const [artifacts] = useState([
    { id: '1', title: 'Ancient Vase', period: '3000 BC', image: '/placeholder.jpg' },
    { id: '2', title: 'Bronze Statue', period: '1500 BC', image: '/placeholder.jpg' },
    { id: '3', title: 'Stone Tablet', period: '2000 BC', image: '/placeholder.jpg' },
  ]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setExhibit(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add a new section
  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      description: '',
      artifacts: []
    };
    
    setExhibit(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    setActiveSection(newSection.id);
    setIsEditing(true);
  };

  // Update section
  const updateSection = (sectionId, updates) => {
    setExhibit(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  };

  // Remove section
  const removeSection = (sectionId) => {
    setExhibit(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    
    if (activeSection === sectionId) {
      setActiveSection(null);
      setIsEditing(false);
    }
  };

  // Toggle artifact selection
  const toggleArtifactSelection = (artifact) => {
    setSelectedArtifacts(prev => 
      prev.some(a => a.id === artifact.id)
        ? prev.filter(a => a.id !== artifact.id)
        : [...prev, artifact]
    );
  };

  // Add selected artifacts to section
  const addArtifactsToSection = () => {
    if (!activeSection || selectedArtifacts.length === 0) return;
    
    const section = exhibit.sections.find(s => s.id === activeSection);
    if (!section) return;
    
    updateSection(activeSection, {
      artifacts: [...section.artifacts, ...selectedArtifacts]
    });
    
    setSelectedArtifacts([]);
    setDialogOpen(false);
    showSnackbar(`Added ${selectedArtifacts.length} artifacts to section`, 'success');
  };

  // Save exhibit
  const saveExhibit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Saving exhibit:', exhibit);
      setIsSubmitting(false);
      showSnackbar('Exhibit saved successfully!', 'success');
      setIsEditing(false);
    }, 1500);
  };

  // Show snackbar
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Exhibit Header */}
      <Card>
        <CardHeader 
          title={isEditing ? 'Edit Exhibit' : 'Create New Exhibit'}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {isEditing ? (
                <>
                  <Button 
                    variant="outlined" 
                    color="inherit"
                    onClick={() => setIsEditing(false)}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={saveExhibit}
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Exhibit'}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setIsEditing(true)}
                  startIcon={<EditIcon />}
                >
                  Edit Exhibit
                </Button>
              )}
            </Box>
          }
        />
        
        <CardContent>
          <TextField
            fullWidth
            label="Exhibit Title"
            name="title"
            value={exhibit.title}
            onChange={handleChange}
            margin="normal"
            disabled={!isEditing}
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={exhibit.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>
      
      {/* Sections */}
      <Card>
        <CardHeader 
          title="Exhibit Sections"
          action={
            isEditing && (
              <Button 
                variant="contained" 
                color="primary"
                onClick={addSection}
                startIcon={<AddIcon />}
              >
                Add Section
              </Button>
            )
          }
        />
        
        <CardContent>
          {exhibit.sections.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <PhotoLibraryIcon fontSize="large" color="action" />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No sections yet
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {isEditing 
                  ? 'Click the button above to add your first section' 
                  : 'This exhibit does not have any sections yet'}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {exhibit.sections.map((section) => (
                <Paper
                  key={section.id}
                  elevation={activeSection === section.id ? 3 : 1}
                  sx={{
                    borderLeft: `4px solid ${activeSection === section.id ? theme.palette.primary.main : 'transparent'}`,
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ flexGrow: 1 }} 
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Typography variant="subtitle1">
                        {section.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {section.artifacts.length} artifacts
                      </Typography>
                    </Box>
                    
                    {isEditing && (
                      <Box>
                        <Tooltip title="Edit Section">
                          <IconButton 
                            onClick={() => setActiveSection(section.id)}
                            color={activeSection === section.id ? 'primary' : 'default'}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete Section">
                          <IconButton 
                            onClick={() => removeSection(section.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </Box>
                  
                  {activeSection === section.id && (
                    <Box sx={{ p: 2, pt: 0 }}>
                      <TextField
                        fullWidth
                        label="Section Title"
                        value={section.title}
                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                        margin="normal"
                        disabled={!isEditing}
                      />
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<AddIcon />}
                        onClick={() => setDialogOpen(true)}
                        disabled={!isEditing}
                        sx={{ mt: 2 }}
                      >
                        Add Artifacts
                      </Button>
                      
                      {section.artifacts.length > 0 ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Artifacts in this section
                          </Typography>
                          
                          <List dense>
                            {section.artifacts.map((artifact) => (
                              <ListItem 
                                key={artifact.id}
                                secondaryAction={
                                  isEditing && (
                                    <IconButton 
                                      edge="end" 
                                      onClick={() => {
                                        updateSection(section.id, {
                                          artifacts: section.artifacts.filter(a => a.id !== artifact.id)
                                        });
                                      }}
                                      color="error"
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  )
                                }
                              >
                                <ListItemIcon>
                                  <Avatar 
                                    src={artifact.image} 
                                    variant="rounded"
                                    sx={{ width: 40, height: 40 }}
                                  >
                                    <PhotoLibraryIcon />
                                  </Avatar>
                                </ListItemIcon>
                                <ListItemText 
                                  primary={artifact.title} 
                                  secondary={artifact.period} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      ) : (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            No artifacts in this section yet. Click 'Add Artifacts' to get started.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Artifact Selection Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Artifacts to Section</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Select artifacts to add to this section
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {artifacts.map(artifact => (
              <Card 
                key={artifact.id}
                sx={{ 
                  width: 200,
                  border: selectedArtifacts.some(a => a.id === artifact.id) 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : '1px solid rgba(0, 0, 0, 0.12)'
                }}
                onClick={() => toggleArtifactSelection(artifact)}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box 
                    component="img"
                    src={artifact.image}
                    alt={artifact.title}
                    sx={{ 
                      width: '100%', 
                      height: 120,
                      objectFit: 'cover',
                      opacity: selectedArtifacts.some(a => a.id === artifact.id) ? 0.7 : 1
                    }}
                  />
                </Box>
                <Box sx={{ p: 1.5 }}>
                  <Typography variant="subtitle2" noWrap>
                    {artifact.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {artifact.period}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={addArtifactsToSection}
            variant="contained"
            disabled={selectedArtifacts.length === 0}
          >
            Add Selected ({selectedArtifacts.length})
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExhibitBuilder;

