import React from 'react';

const Tours = () => {
  return (
    <div className="min-h-screen bg-background text-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Live Tours</h1>
          <p className="text-xl text-muted-foreground">
            Experience Ethiopian heritage through guided virtual and physical tours
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-3">Virtual Museum Tours</h3>
            <p className="text-muted-foreground mb-4">
              Explore museums from anywhere in the world with our immersive virtual tours
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Explore Tours
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-3">Live Guided Tours</h3>
            <p className="text-muted-foreground mb-4">
              Join expert guides for real-time tours of Ethiopian heritage sites
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Book Now
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl font-semibold mb-3">Cultural Experiences</h3>
            <p className="text-muted-foreground mb-4">
              Immerse yourself in Ethiopian culture through interactive experiences
            </p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tours;