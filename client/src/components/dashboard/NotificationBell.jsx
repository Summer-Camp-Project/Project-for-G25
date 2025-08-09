import React, { useState, useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

const notificationTypes = {
  success: {
    icon: <CheckCircleIcon color="success" />,
    bgcolor: 'success.light',
  },
  error: {
    icon: <ErrorIcon color="error" />,
    bgcolor: 'error.light',
  },
  info: {
    icon: <InfoIcon color="info" />,
    bgcolor: 'info.light',
  },
  warning: {
    icon: <WarningIcon color="warning" />,
    bgcolor: 'warning.light',
  },
};

// Mock notifications - replace with actual API calls
const mockNotifications = [
  {
    id: 1,
    title: 'New artifact submission',
    message: 'A new artifact has been submitted for review',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    link: '/admin/artifacts',
  },
  {
    id: 2,
    title: 'Rental request',
    message: 'Your rental request has been approved',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    link: '/rentals',
  },
  {
    id: 3,
    title: 'System Update',
    message: 'Scheduled maintenance this weekend',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    link: '/notifications',
  },
];

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const theme = useTheme();
  const { user } = useAuth();

  const open = Boolean(anchorEl);

  // Count unread notifications
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark all as read when opening
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    // Handle navigation to notification link
    console.log('Navigate to:', notification.link);
    // Close the menu
    handleClose();
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = new Date(notification.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-label="show notifications"
          aria-controls="notification-menu"
          aria-haspopup="true"
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 400,
            maxHeight: 500,
          },
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        TransitionComponent={Fade}
      >
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="div">
            Notifications
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {unreadCount} unread
          </Typography>
        </Box>
        <Divider />

        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
            <Box key={date}>
              <Box px={2} py={1} bgcolor="action.hover">
                <Typography variant="subtitle2" color="textSecondary">
                  {date === new Date().toDateString() ? 'Today' : date}
                </Typography>
              </Box>
              {dayNotifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    borderLeft: `4px solid ${theme.palette[notification.type]?.main || theme.palette.primary.main}`,
                    bgcolor: notification.read ? 'background.paper' : 'action.hover',
                    '&:hover': {
                      bgcolor: 'action.selected',
                    },
                  }}
                >
                  <ListItemIcon>
                    {notificationTypes[notification.type]?.icon || <InfoIcon color="primary" />}
                  </ListItemIcon>
                  <Box sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle2" component="div">
                        {notification.title}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" noWrap>
                      {notification.message}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          ))}
          
          {notifications.length === 0 && (
            <Box p={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                No new notifications
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />
        <Box p={1} textAlign="center">
          <Typography 
            variant="button" 
            color="primary" 
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              console.log('View all notifications');
              handleClose();
            }}
          >
            VIEW ALL
          </Typography>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;