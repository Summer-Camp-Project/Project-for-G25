// Sample user data
export const currentUser = {
  id: '1',
  name: 'Abebe Mekuria',
  email: 'abebe.mekuria@ethioheritage360.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  role: 'tour_organizer'
};

// Sample tour packages
export const tourPackages = [
  {
    id: '1',
    title: 'Lalibela Rock Churches Tour',
    description: 'Explore the magnificent rock-hewn churches of Lalibela, a UNESCO World Heritage site dating back to the 12th century.',
    location: 'Lalibela, Amhara',
    region: 'Amhara',
    duration: '3 days',
    price: 450,
    maxGuests: 12,
    images: ['https://i.postimg.cc/XYfd9Rhq/lalibela-churchofstgeorgesideview.jpg'],
    difficulty: 'moderate',
    category: 'Religious & Historical',
    status: 'active',
    createdAt: '2024-12-01',
    updatedAt: '2024-12-15'
  },
  {
    id: '2',
    title: 'Danakil Depression Adventure',
    description: 'Journey to one of the hottest and lowest places on Earth, featuring salt lakes, volcanic activity, and the famous Erta Ale volcano.',
    location: 'Danakil Depression, Afar',
    region: 'Afar',
    duration: '4 days',
    price: 650,
    maxGuests: 8,
    images: ['https://i.postimg.cc/1tfK0Wwd/47689864-303583397030165-1011221645663628875-n-1000x667.jpg'],
    difficulty: 'hard',
    category: 'Adventure & Nature',
    status: 'active',
    createdAt: '2024-11-20',
    updatedAt: '2024-12-10'
  },
  {
    id: '3',
    title: 'Simien Mountains Trek',
    description: 'Trek through the stunning Simien Mountains National Park, home to unique wildlife including gelada baboons and Walia ibex.',
    location: 'Simien Mountains, Amhara',
    region: 'Amhara',
    duration: '5 days',
    price: 580,
    maxGuests: 10,
    images: ['https://i.postimg.cc/JzpJTNrC/images.jpg'],
    difficulty: 'hard',
    category: 'Adventure & Nature',
    status: 'active',
    createdAt: '2024-11-15',
    updatedAt: '2024-12-05'
  },
  {
    id: '4',
    title: 'Omo Valley Cultural Experience',
    description: 'Immerse yourself in the diverse cultures of the Omo Valley tribes, experiencing traditional ways of life and ancient customs.',
    location: 'Omo Valley, SNNPR',
    region: 'SNNPR',
    duration: '6 days',
    price: 720,
    maxGuests: 6,
    images: ['https://i.postimg.cc/m2bt0P6L/images-1.jpg'],
    difficulty: 'moderate',
    category: 'Cultural & Tribal',
    status: 'active',
    createdAt: '2024-11-10',
    updatedAt: '2024-11-25'
  },
  {
    "id": "5",
    "title": "Harar Jugol: The Walled City",
    "description": "Explore the ancient walled city of Harar, a UNESCO World Heritage site known for its vibrant markets, unique architecture, and the hyena man feeding ritual.",
    "location": "Harar, Harari",
    "region": "Harari",
    "duration": "3 days",
    "price": 450,
    "maxGuests": 8,
    "images": [
      "https://i.postimg.cc/3NqVC4kX/images-2.jpg"
    ],
    "difficulty": "easy",
    "category": "Cultural",
    "status": "active",
    "createdAt": "2024-10-20",
    "updatedAt": "2024-11-21"
  },
  {
    "id": "6",
    "title": "Lake Tana Monasteries and Blue Nile Falls",
    "description": "Visit the ancient island monasteries of Lake Tana, home to priceless religious artifacts, and witness the power of the Blue Nile Falls, also known as 'Tis Abay'.",
    "location": "Bahir Dar, Amhara",
    "region": "Amhara",
    "duration": "2 days",
    "price": 280,
    "maxGuests": 12,
    "images": [
      "https://i.postimg.cc/c4mXS8xX/hztljbok641fwian2fhr.webp"
    ],
    "difficulty": "easy",
    "category": "Historical & Nature",
    "status": "active",
    "createdAt": "2024-11-01",
    "updatedAt": "2024-11-23"
  }

];

// Sample bookings
export const bookings = [
  {
    id: '1',
    tourPackageId: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    guests: 4,
    tourDate: '2025-01-15',
    status: 'confirmed',
    totalAmount: 1800,
    specialRequests: 'Vegetarian meals required',
    createdAt: '2024-12-20T10:30:00Z'
  },
  {
    id: '2',
    tourPackageId: '2',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    guests: 2,
    tourDate: '2025-01-17',
    status: 'pending',
    totalAmount: 1300,
    createdAt: '2024-12-22T14:15:00Z'
  },
  {
    id: '3',
    tourPackageId: '3',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.wilson@email.com',
    guests: 6,
    tourDate: '2025-01-20',
    status: 'confirmed',
    totalAmount: 3480,
    specialRequests: 'Photography equipment transport assistance',
    createdAt: '2024-12-18T09:45:00Z'
  },
  {
    id: '4',
    tourPackageId: '4',
    customerName: 'David Rodriguez',
    customerEmail: 'david.rodriguez@email.com',
    guests: 3,
    tourDate: '2025-01-23',
    status: 'confirmed',
    totalAmount: 2160,
    createdAt: '2024-12-19T16:20:00Z'
  },
  {
    id: '5',
    tourPackageId: '1',
    customerName: 'Lisa Thompson',
    customerEmail: 'lisa.thompson@email.com',
    guests: 5,
    tourDate: '2025-01-25',
    status: 'pending',
    totalAmount: 2250,
    specialRequests: 'Early morning pickup requested',
    createdAt: '2024-12-23T11:10:00Z'
  }
];

// Sample activities
export const activities = [
  {
    id: '1',
    type: 'booking',
    title: 'New booking request',
    description: 'Lalibela Rock Churches Tour - 4 guests',
    time: '2 hours ago',
    user: 'Sarah Johnson',
    status: 'pending',
    relatedId: '1'
  },
  {
    id: '2',
    type: 'message',
    title: 'Customer message',
    description: 'Question about Danakil Depression tour itinerary',
    time: '4 hours ago',
    user: 'Michael Chen',
    status: 'unread',
    relatedId: '2'
  },
  {
    id: '3',
    type: 'tour_update',
    title: 'Tour package updated',
    description: 'Simien Mountains Trek - Updated pricing',
    time: '6 hours ago',
    user: 'System',
    status: 'updated',
    relatedId: '3'
  },
  {
    id: '4',
    type: 'booking',
    title: 'Booking confirmed',
    description: 'Omo Valley Cultural Tour - 2 guests',
    time: '1 day ago',
    user: 'Emma Wilson',
    status: 'confirmed',
    relatedId: '4'
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment received',
    description: '$1,800 payment for Lalibela tour',
    time: '1 day ago',
    user: 'Sarah Johnson',
    status: 'completed',
    relatedId: '1'
  }
];

// Sample messages
export const messages = [
  {
    id: '1',
    customerName: 'Michael Chen',
    customerEmail: 'michael.chen@email.com',
    subject: 'Danakil Depression Tour Inquiry',
    message: "Hi, I'd like to know more about the Danakil Depression tour. What's included in the package and what should I bring?",
    status: 'unread',
    createdAt: '2024-12-23T08:30:00Z',
    relatedBookingId: '2'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    subject: 'Dietary Requirements',
    message: 'Hello, I have dietary restrictions for my upcoming Lalibela tour. Can you accommodate vegetarian meals?',
    status: 'read',
    createdAt: '2024-12-22T15:45:00Z',
    relatedBookingId: '1'
  },
  {
    id: '3',
    customerName: 'Lisa Thompson',
    customerEmail: 'lisa.thompson@email.com',
    subject: 'Group Booking Discount',
    message: "Hi, I'm booking for 5 people. Do you offer any group discounts for the Lalibela tour?",
    status: 'unread',
    createdAt: '2024-12-23T11:15:00Z',
    relatedBookingId: '5'
  }
];

// Sample notifications
export const notifications = [
  {
    id: '1',
    title: 'New Booking Request',
    message: 'Lisa Thompson requested a booking for Lalibela Rock Churches Tour',
    type: 'info',
    read: false,
    createdAt: '2024-12-23T11:10:00Z'
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of $1,800 received from Sarah Johnson',
    type: 'success',
    read: false,
    createdAt: '2024-12-23T09:30:00Z'
  },
  {
    id: '3',
    title: 'Customer Message',
    message: 'New message from Michael Chen about Danakil Depression tour',
    type: 'info',
    read: false,
    createdAt: '2024-12-23T08:30:00Z'
  }
];

// Helper functions to calculate dashboard stats
export const getDashboardStats = () => {
  const totalTours = tourPackages.filter(tour => tour.status === 'active').length;
  const upcomingBookings = bookings.filter(booking =>
    new Date(booking.tourDate) > new Date() && booking.status === 'confirmed'
  ).length;
  const completedTours = bookings.filter(booking =>
    new Date(booking.tourDate) < new Date() && booking.status === 'completed'
  ).length;
  const pendingRequests = bookings.filter(booking => booking.status === 'pending').length;

  return {
    totalTours,
    upcomingBookings,
    completedTours,
    pendingRequests
  };
};

// Helper function to get upcoming tours for calendar
export const getUpcomingTours = () => {
  return bookings
    .filter(booking => new Date(booking.tourDate) >= new Date())
    .map(booking => {
      const tour = tourPackages.find(t => t.id === booking.tourPackageId);
      return {
        ...booking,
        tourTitle: tour ? tour.title : 'Unknown Tour',
        location: tour ? tour.location : 'Unknown Location'
      };
    })
    .sort((a, b) => new Date(a.tourDate) - new Date(b.tourDate))
    .slice(0, 4);
};
