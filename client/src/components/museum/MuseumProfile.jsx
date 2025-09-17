import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Grid, Paper, TextField, Button,
  Avatar, FormControl, InputLabel, Select, MenuItem, Chip,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import {
  Building2,
  Camera,
  MapPin,
  Clock,
  Mail,
  Phone,
  Globe,
  Users,
  Calendar,
  DollarSign
} from 'lucide-react';
import api from '../../utils/api';

const MuseumProfile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    location: '',
    phone: '',
    email: '',
    website: '',
    openingHours: '',
    admissionFee: 0,
    capacity: 0,
    founded: '',
    languages: [],
    facilities: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load museum profile on component mount
  useEffect(() => {
    const loadMuseumProfile = async () => {
      try {
        setLoading(true);
        console.log('=== LOADING MUSEUM PROFILE ===');
        const response = await api.getMuseumProfile();
        console.log('Museum profile response:', response);
        if (response.museum) {
          console.log('Setting profile data:', response.museum);
          setProfileData(response.museum);
        } else if (response.data) {
          console.log('Setting profile data:', response.data);
          setProfileData(response.data);
        } else {
          console.log('No data in response');
        }
      } catch (error) {
        console.error('Error loading museum profile:', error);
        setSnackbar({
          open: true,
          message: 'Failed to load museum profile',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadMuseumProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = async () => {
    setIsEditing(false);
    // Reload the original data
    try {
      setLoading(true);
      const response = await api.getMuseumProfile();
      if (response.museum) {
        setProfileData(response.museum);
      } else if (response.data) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error reloading museum profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      console.log('=== SAVING MUSEUM PROFILE ===');
      console.log('Profile data being saved:', profileData);

      const response = await api.updateMuseumProfile(profileData);
      console.log('Save response:', response);

      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Museum profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving museum profile:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update museum profile',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const response = await api.uploadMuseumLogo(file);
      setSnackbar({
        open: true,
        message: 'Museum logo uploaded successfully',
        severity: 'success'
      });
      // Optionally refresh profile data to get updated logo
      const profileResponse = await api.getMuseumProfile();
      if (profileResponse.museum) {
        setProfileData(prev => ({
          ...prev,
          logo: profileResponse.museum.logo
        }));
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to upload logo',
        severity: 'error'
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading museum profile...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <Building2 className="mr-3" size={32} />
          Museum Profile Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your museum's comprehensive information and public profile
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Building2 className="mr-2" size={20} />
              Basic Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Museum Name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Museum Name</Typography>
                    <Typography variant="body1">{profileData.name || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Museum Description"
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={4}
                    margin="normal"
                    helperText="Provide a compelling description of your museum's mission and collections"
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Museum Description</Typography>
                    <Typography variant="body1">{profileData.description || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Founded Year"
                    value={profileData.founded}
                    onChange={(e) => handleInputChange('founded', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Founded Year</Typography>
                    <Typography variant="body1">{profileData.founded || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Visitor Capacity"
                    type="number"
                    value={profileData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Visitor Capacity</Typography>
                    <Typography variant="body1">{profileData.capacity || 'Not specified'}</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Contact Information */}
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Phone className="mr-2" size={20} />
              Contact Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Location Address"
                    value={typeof profileData.location === 'object' ? profileData.location.address || '' : profileData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    margin="normal"
                    InputProps={{
                      startAdornment: <MapPin className="mr-2 text-gray-400" size={16} />
                    }}
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Location Address</Typography>
                    <Typography variant="body1">
                      {profileData.location ?
                        (typeof profileData.location === 'object' ?
                          profileData.location.address || 'Address not specified' :
                          profileData.location) :
                        'Not specified'}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={typeof profileData.phone === 'object' ? profileData.phone.phone || '' : profileData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Phone className="mr-2 text-gray-400" size={16} />
                    }}
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Phone Number</Typography>
                    <Typography variant="body1">
                      {profileData.phone ?
                        (typeof profileData.phone === 'object' ?
                          profileData.phone.phone || 'Phone not specified' :
                          profileData.phone) :
                        'Not specified'}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Email Address"
                    value={typeof profileData.email === 'object' ? profileData.email.email || '' : profileData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Mail className="mr-2 text-gray-400" size={16} />
                    }}
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Email Address</Typography>
                    <Typography variant="body1">
                      {profileData.email ?
                        (typeof profileData.email === 'object' ?
                          profileData.email.email || 'Email not specified' :
                          profileData.email) :
                        'Not specified'}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Website"
                    value={typeof profileData.website === 'object' ? profileData.website.website || '' : profileData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    margin="normal"
                    InputProps={{
                      startAdornment: <Globe className="mr-2 text-gray-400" size={16} />
                    }}
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Website</Typography>
                    <Typography variant="body1">
                      {profileData.website ?
                        (typeof profileData.website === 'object' ?
                          profileData.website.website || 'Website not specified' :
                          profileData.website) :
                        'Not specified'}
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Paper>

          {/* Operating Information */}
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Clock className="mr-2" size={20} />
              Operating Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Opening Hours"
                    value={typeof profileData.openingHours === 'string' ? profileData.openingHours : ''}
                    onChange={(e) => handleInputChange('openingHours', e.target.value)}
                    margin="normal"
                    helperText="e.g., 9:00 AM - 6:00 PM"
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Opening Hours</Typography>
                    <Typography variant="body1">
                      {profileData.openingHours ?
                        (typeof profileData.openingHours === 'string' ?
                          profileData.openingHours :
                          'Complex schedule - see edit mode') :
                        'Not specified'}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                {isEditing ? (
                  <TextField
                    fullWidth
                    label="Admission Fee (ETB)"
                    type="number"
                    value={typeof profileData.admissionFee === 'object' ? profileData.admissionFee.adult || '' : profileData.admissionFee || ''}
                    onChange={(e) => handleInputChange('admissionFee', e.target.value)}
                    margin="normal"
                  />
                ) : (
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Admission Fee (ETB)</Typography>
                    <Typography variant="body1">
                      {profileData.admissionFee ?
                        (typeof profileData.admissionFee === 'object' ?
                          `Adult: ${profileData.admissionFee.adult || 'N/A'} ETB` :
                          `${profileData.admissionFee} ETB`) :
                        'Not specified'}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Supported Languages</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(profileData.languages || []).map((language, index) => (
                    <Chip key={index} label={language} variant="outlined" />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Available Facilities</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {(profileData.facilities || []).map((facility, index) => (
                    <Chip key={index} label={facility} color="primary" variant="outlined" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Museum Logo and Images */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Camera className="mr-2" size={20} />
              Museum Logo
            </Typography>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
                src={profileData.logo?.url ? `http://localhost:5000${profileData.logo.url}` : undefined}
              >
                {!profileData.logo?.url && <Building2 size={60} />}
              </Avatar>
              {isEditing && (
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={uploadingLogo}
                  startIcon={uploadingLogo ? <CircularProgress size={16} /> : <Camera />}
                >
                  {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </Button>
              )}
            </Box>
          </Paper>

          <Paper sx={{ p: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Quick Stats</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Total Visitors</Typography>
                <Typography variant="h6">12,450</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Monthly Growth</Typography>
                <Typography variant="h6" color="success.main">+15%</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">Rating</Typography>
                <Typography variant="h6">4.7/5.0</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Profile Completion</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completion</Typography>
                <Typography variant="body2">85%</Typography>
              </Box>
              <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1 }}>
                <Box
                  sx={{
                    width: '85%',
                    height: 8,
                    bgcolor: 'primary.main',
                    borderRadius: 1
                  }}
                />
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Complete your profile to improve visibility and user experience
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mt: 4, textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center' }}>
        {!isEditing ? (
          <Button
            variant="contained"
            size="large"
            onClick={handleEdit}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            Edit Profile
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              size="large"
              onClick={handleCancel}
              disabled={saving}
              sx={{ minWidth: 120 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={saving || loading}
              startIcon={saving ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 200 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MuseumProfile;
