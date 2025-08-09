import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  tourPackages as initialTourPackages,
  bookings as initialBookings,
  activities as initialActivities,
  messages as initialMessages,
  notifications as initialNotifications,
  currentUser,
  getDashboardStats,
  getUpcomingTours
} from '../data/sampleData';

export const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  // State
  const [tourPackages, setTourPackages] = useState(initialTourPackages);
  const [bookings, setBookings] = useState(initialBookings);
  const [activities, setActivities] = useState(initialActivities);
  const [messages, setMessages] = useState(initialMessages);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Navigation
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI State
  const [showCreateTourModal, setShowCreateTourModal] = useState(false);
  const [showBookingRequestsModal, setShowBookingRequestsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Computed values
  const dashboardStats = getDashboardStats();
  const upcomingTours = getUpcomingTours();
  
  // Actions
  const createTourPackage = useCallback((newTour) => {
    const tour = {
      ...newTour,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTourPackages(prev => [tour, ...prev]);
    
    // Add activity
    addActivity({
      type: 'tour_update',
      title: 'New tour package created',
      description: `${newTour.title} has been added to your offerings`,
      time: 'Just now',
      user: 'System',
      status: 'updated',
      relatedId: tour.id
    });
  }, []);
  
  const updateBookingStatus = useCallback((bookingId, status) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId
          ? { ...booking, status }
          : booking
      )
    );
    
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      addActivity({
        type: 'booking',
        title: `Booking ${status}`,
        description: `${booking.customerName}'s booking has been ${status}`,
        time: 'Just now',
        user: booking.customerName,
        status: status === 'confirmed' ? 'confirmed' : 'updated',
        relatedId: bookingId
      });
    }
  }, [bookings]);
  
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);
  
  const markMessageAsRead = useCallback((messageId) => {
    setMessages(prev =>
      prev.map(message =>
        message.id === messageId
          ? { ...message, status: 'read' }
          : message
      )
    );
  }, []);
  
  const addActivity = useCallback((newActivity) => {
    const activity = {
      ...newActivity,
      id: Date.now().toString()
    };
    
    setActivities(prev => [activity, ...prev.slice(0, 9)]);
  }, []);
  
  const deleteTourPackage = useCallback((tourId) => {
    setTourPackages(prev => prev.filter(tour => tour.id !== tourId));
    
    // Add activity
    const tour = tourPackages.find(t => t.id === tourId);
    if (tour) {
      addActivity({
        type: 'tour_update',
        title: 'Tour package deleted',
        description: `${tour.title} has been removed from your offerings`,
        time: 'Just now',
        user: 'System',
        status: 'updated',
        relatedId: tourId
      });
    }
  }, [tourPackages, addActivity]);
  
  const value = {
    // Data
    tourPackages,
    bookings,
    activities,
    messages,
    notifications,
    currentUser,
    
    // Navigation
    currentPage,
    setCurrentPage,
    
    // Search and filters
    searchQuery,
    setSearchQuery,
    
    // Stats
    dashboardStats,
    upcomingTours,
    
    // Actions
    createTourPackage,
    updateBookingStatus,
    markNotificationAsRead,
    markMessageAsRead,
    addActivity,
    deleteTourPackage,
    
    // UI State
    showCreateTourModal,
    setShowCreateTourModal,
    showBookingRequestsModal,
    setShowBookingRequestsModal,
    
    // Loading states
    isLoading,
    setIsLoading
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};