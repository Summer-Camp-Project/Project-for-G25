
import { useState } from 'react';
import {
  Box, Button, Card, CardContent, CardHeader, Divider, Grid, TextField, Typography,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, Paper,
  List, ListItem, ListItemText, ListItemSecondaryAction, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, LinearProgress,
  Tabs, Tab, useTheme, Badge, Tooltip, Collapse
} from '@mui/material';
import {
  Save as SaveIcon, Refresh as RefreshIcon, Lock as LockIcon,
  Notifications as NotificationsIcon, Email as EmailIcon, Language as LanguageIcon,
  Info as InfoIcon, ExpandLess, ExpandMore, Storage as StorageIcon,
  Backup as BackupIcon, Code as CodeIcon, VpnKey as VpnKeyIcon
} from '@mui/icons-material';

const SystemSettings = ({ onSave, loading = false }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [openSections, setOpenSections] = useState({
    general: true,
    security: true,
    notifications: false,
  });
  
  // Form state
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Museum Platform',
    siteUrl: 'https://museum-platform.com',
    adminEmail: 'admin@museum-platform.com',
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    
    // Security Settings
    requireEmailVerification: true,
    enable2FA: false,
    passwordMinLength: 8,
    
    // Notification Settings
    emailNotifications: true,
    emailFrom: 'noreply@museum-platform.com',
    emailFromName: 'Museum Platform',
    
    // Maintenance Mode
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle form field changes
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.value;
      
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save settings
  const handleSave = async () => {
    try {
      // In a real app, you would call an API endpoint here
      // await onSave(settings);
      
      setSnackbar({
        open: true,
        message: 'Settings saved successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save settings. Please try again.',
        severity: 'error',
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false,
    }));
  };

  // Timezone options
  const timezones = [
    'Africa/Addis_Ababa',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo',
  ];

  // Date format options
  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2023)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2023)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2023-12-31)' },
  ];

  // Time format options
  const timeFormats = [
    { value: '12h', label: '12-hour (2:30 PM)' },
    { value: '24h', label: '24-hour (14:30)' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="general" label="General" icon={<LanguageIcon />} iconPosition="start" />
        <Tab value="security" label="Security" icon={<LockIcon />} iconPosition="start" />
        <Tab value="notifications" label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        <Tab value="maintenance" label="Maintenance" icon={<StorageIcon />} iconPosition="start" />
      </Tabs>

      {loading && <LinearProgress />}

      {/* General Settings */}
      <Collapse in={activeTab === 'general'}>
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="General Settings" 
            avatar={<LanguageIcon color="primary" />}
            action={
              <IconButton onClick={() => toggleSection('general')}>
                {openSections.general ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
          />
          <Collapse in={openSections.general}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Site Name"
                    value={settings.siteName}
                    onChange={handleChange('siteName')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Site URL"
                    value={settings.siteUrl}
                    onChange={handleChange('siteUrl')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Admin Email"
                    type="email"
                    value={settings.adminEmail}
                    onChange={handleChange('adminEmail')}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.timezone}
                      onChange={handleChange('timezone')}
                      label="Timezone"
                    >
                      {timezones.map((tz) => (
                        <MenuItem key={tz} value={tz}>
                          {tz}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Date Format</InputLabel>
                    <Select
                      value={settings.dateFormat}
                      onChange={handleChange('dateFormat')}
                      label="Date Format"
                    >
                      {dateFormats.map((format) => (
                        <MenuItem key={format.value} value={format.value}>
                          {format.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Time Format</InputLabel>
                    <Select
                      value={settings.timeFormat}
                      onChange={handleChange('timeFormat')}
                      label="Time Format"
                    >
                      {timeFormats.map((format) => (
                        <MenuItem key={format.value} value={format.value}>
                          {format.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </Collapse>

      {/* Security Settings */}
      <Collapse in={activeTab === 'security'}>
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Security Settings" 
            avatar={<LockIcon color="primary" />}
            action={
              <IconButton onClick={() => toggleSection('security')}>
                {openSections.security ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
          />
          <Collapse in={openSections.security}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.requireEmailVerification}
                        onChange={handleChange('requireEmailVerification')}
                        color="primary"
                      />
                    }
                    label="Require Email Verification"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
                    New users must verify their email address before they can log in.
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enable2FA}
                        onChange={handleChange('enable2FA')}
                        color="primary"
                      />
                    }
                    label="Enable Two-Factor Authentication (2FA)"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
                    Require users to set up 2FA for added security.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Password Length"
                    value={settings.passwordMinLength}
                    onChange={handleChange('passwordMinLength')}
                    margin="normal"
                    inputProps={{ min: 6, max: 32 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </Collapse>

      {/* Notification Settings */}
      <Collapse in={activeTab === 'notifications'}>
        <Card sx={{ mb: 3 }}>
          <CardHeader 
            title="Notification Settings" 
            avatar={<NotificationsIcon color="primary" />}
            action={
              <IconButton onClick={() => toggleSection('notifications')}>
                {openSections.notifications ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
          />
          <Collapse in={openSections.notifications}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleChange('emailNotifications')}
                        color="primary"
                      />
                    }
                    label="Enable Email Notifications"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="From Email"
                    type="email"
                    value={settings.emailFrom}
                    onChange={handleChange('emailFrom')}
                    margin="normal"
                    disabled={!settings.emailNotifications}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="From Name"
                    value={settings.emailFromName}
                    onChange={handleChange('emailFromName')}
                    margin="normal"
                    disabled={!settings.emailNotifications}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Collapse>
        </Card>
      </Collapse>

      {/* Maintenance Settings */}
      <Collapse in={activeTab === 'maintenance'}>
        <Card>
          <CardHeader 
            title="Maintenance Mode" 
            avatar={<StorageIcon color="primary" />}
          />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={handleChange('maintenanceMode')}
                      color="primary"
                    />
                  }
                  label="Enable Maintenance Mode"
                />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1, mb: 2 }}>
                  When enabled, only administrators can access the site.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Maintenance Message"
                  multiline
                  rows={4}
                  value={settings.maintenanceMessage}
                  onChange={handleChange('maintenanceMessage')}
                  margin="normal"
                  disabled={!settings.maintenanceMode}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Collapse>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;

