import React, { useState, useEffect } from 'react';
import TourCard from '../components/tours/TourCard';
import TourBooking from '../components/tours/TourBooking';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock data for tours - replace with API calls
  const mockTours = [
    {
      id: 1,
      title: 'Historic Addis Ababa Tour',
      description: 'Explore the historical landmarks of Addis Ababa, including the National Museum, Holy Trinity Cathedral, and Merkato. This tour offers a deep dive into the city\'s rich past and vibrant present.',
      location: 'Addis Ababa',
      date: 'Every Saturday & Sunday',
      price: 50,
      maxPeople: 20,
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Lalibela Rock-Hewn Churches Expedition',
      description: 'A spiritual and architectural marvel, this tour takes you to the UNESCO World Heritage site of Lalibela, famous for its monolithic churches carved directly out of rock.',
      location: 'Lalibela',
      date: 'Monthly departures',
      price: 120,
      maxPeople: 10,
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Simien Mountains Trekking Adventure',
      description: 'Embark on an unforgettable trekking adventure through the breathtaking landscapes of the Simien Mountains National Park, home to unique wildlife like the Gelada baboon.',
      location: 'Simien Mountains',
      date: 'Bi-weekly departures',
      price: 200,
      maxPeople: 8,
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Danakil Depression Expedition',
      description: 'Journey to one of the hottest places on Earth, the Danakil Depression, known for its active volcanoes, colorful sulfur springs, and salt flats. An extreme adventure for the daring!',
      location: 'Danakil Depression',
      date: 'Seasonal',
      price: 300,
      maxPeople: 6,
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'Omo Valley Cultural Tour',
      description: 'Immerse yourself in the diverse cultures of the Omo Valley, encountering various indigenous tribes with their unique traditions and lifestyles.',
      location: 'Omo Valley',
      date: 'Customizable',
      price: 250,
      maxPeople: 12,
      image: '/api/placeholder/400/250'
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch tours
    setTimeout(() => {
      setTours(mockTours);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (tour) => {
    setSelectedTour(tour);
    // In a real app, you might navigate to a dedicated tour detail page
    alert(`Viewing details for: ${tour.title}`);
  };

  const handleBookTour = (tour) => {
    setSelectedTour(tour);
    setShowBookingModal(true);
  };

  const handleBookingConfirm = (bookingInfo) => {
    console.log('Booking Confirmed:', bookingInfo);
    setShowBookingModal(false);
    setSelectedTour(null);
    alert('Your tour has been booked!');
  };

  const handleBookingCancel = () => {
    setShowBookingModal(false);
    setSelectedTour(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tours...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Explore Our Tours</h1>
          <p className="mt-1 text-gray-600">
            Discover unique and immersive experiences across Ethiopia
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tours.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No tours available at the moment. Please check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <TourCard
                key={tour.id}
                tour={tour}
                onViewDetails={handleViewDetails}
                onBookTour={handleBookTour}
              />
            ))}
          </div>
        )}
      </div>

      {showBookingModal && selectedTour && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <TourBooking
            tour={selectedTour}
            onBookingConfirm={handleBookingConfirm}
            onBookingCancel={handleBookingCancel}
          />
        </div>
      )}
    </div>
  );
};

export default Tours;