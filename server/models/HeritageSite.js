const mongoose = require('mongoose');

const heritageSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
      }
    },
    address: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Archaeological Site',
      'Religious Site', 
      'Cultural Monument',
      'UNESCO World Heritage',
      'National Heritage',
      'Museum',
      'Natural Heritage',
      'Historical Site'
    ]
  },
  significance: {
    type: String,
    enum: ['UNESCO World Heritage', 'National', 'Regional', 'Local'],
    default: 'Local'
  },
  yearEstablished: {
    type: Number,
    min: 0
  },
  historicalPeriod: {
    type: String
  },
  images: [{
    url: String,
    caption: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  features: [{
    type: String
  }],
  visitingInfo: {
    isAccessible: {
      type: Boolean,
      default: true
    },
    visitingHours: {
      type: String
    },
    entryFee: {
      type: String
    },
    bestTimeToVisit: {
      type: String
    }
  },
  culturalImportance: {
    type: String
  },
  languages: [{
    code: {
      type: String,
      enum: ['en', 'am', 'om', 'ti'] // English, Amharic, Oromo, Tigrinya
    },
    name: String,
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
heritageSiteSchema.index({ 
  "location.coordinates.latitude": 1, 
  "location.coordinates.longitude": 1 
});

// Index for text search
heritageSiteSchema.index({ 
  name: 'text', 
  description: 'text',
  'location.address': 'text',
  'location.region': 'text'
});

// Virtual for main image
heritageSiteSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || this.images[0] || null;
});

// Method to get coordinates for mapping
heritageSiteSchema.methods.getMapCoordinates = function() {
  return {
    lat: this.location.coordinates.latitude,
    lng: this.location.coordinates.longitude,
    name: this.name,
    id: this._id
  };
};

// Static method to get sites by region
heritageSiteSchema.statics.getSitesByRegion = function(region) {
  return this.find({ 
    'location.region': new RegExp(region, 'i'),
    isActive: true 
  });
};

// Static method to get sites by category
heritageSiteSchema.statics.getSitesByCategory = function(category) {
  return this.find({ 
    category: category,
    isActive: true 
  });
};

module.exports = mongoose.model('HeritageSite', heritageSiteSchema);
