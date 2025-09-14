const Museum = require('../models/Museum');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const fs = require('fs').promises;
const path = require('path');

/**
 * @desc    Create a new museum
 * @route   POST /api/museums
 * @access  Private (superAdmin, museumAdmin)
 */
exports.createMuseum = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const {
      name,
      location,
      description,
      contactEmail,
      contactPhone,
      website,
      address,
      operatingHours,
      settings,
      socialMedia
    } = req.body;

    // Check if museum with email already exists
    const existingMuseum = await Museum.findOne({ contactEmail });
    if (existingMuseum) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'MUSEUM_EXISTS',
          message: 'Museum with this email already exists'
        }
      });
    }

    // Create museum
    const museum = new Museum({
      name,
      location,
      description,
      contactEmail,
      contactPhone,
      website,
      address,
      operatingHours,
      settings: {
        allowRentals: settings?.allowRentals ?? true,
        maxRentalDuration: settings?.maxRentalDuration ?? 30,
        requireInsurance: settings?.requireInsurance ?? true,
        autoApproveRentals: settings?.autoApproveRentals ?? false
      },
      socialMedia,
      createdBy: req.user.userId
    });

    await museum.save();

    res.status(201).json({
      success: true,
      data: museum,
      message: 'Museum created successfully'
    });

  } catch (error) {
    console.error('Create museum error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Get single museum by ID
 * @route   GET /api/museums/:id
 * @access  Public
 */
exports.getMuseum = async (req, res) => {
  try {
    const { id } = req.params;

    const museum = await Museum.findById(id)
      .populate('createdBy', 'name email')
      .select('-__v');

    if (!museum) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MUSEUM_NOT_FOUND',
          message: 'Museum not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: museum
    });

  } catch (error) {
    console.error('Get museum error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MUSEUM_ID',
          message: 'Invalid museum ID format'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Update museum
 * @route   PUT /api/museums/:id
 * @access  Private (superAdmin, museumAdmin for own museum)
 */
exports.updateMuseum = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errors.array()
        }
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Find the museum first
    const museum = await Museum.findById(id);
    if (!museum) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MUSEUM_NOT_FOUND',
          message: 'Museum not found'
        }
      });
    }

    // Check authorization (superAdmin can edit any museum, museumAdmin can edit only their own)
    if (req.user.role !== 'superAdmin') {
      if (req.user.role !== 'museumAdmin' || req.user.museum !== id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only update your own museum'
          }
        });
      }
    }

    // Check if email is being changed and if it already exists
    if (updateData.contactEmail && updateData.contactEmail !== museum.contactEmail) {
      const existingMuseum = await Museum.findOne({ 
        contactEmail: updateData.contactEmail,
        _id: { $ne: id }
      });
      
      if (existingMuseum) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Museum with this email already exists'
          }
        });
      }
    }

    // Update museum
    const updatedMuseum = await Museum.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedMuseum,
      message: 'Museum updated successfully'
    });

  } catch (error) {
    console.error('Update museum error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MUSEUM_ID',
          message: 'Invalid museum ID format'
        }
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'DUPLICATE_EMAIL',
          message: 'Museum with this email already exists'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Delete museum (soft delete)
 * @route   DELETE /api/museums/:id
 * @access  Private (superAdmin only)
 */
exports.deleteMuseum = async (req, res) => {
  try {
    const { id } = req.params;

    // Only superAdmin can delete museums
    if (req.user.role !== 'superAdmin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Only super administrators can delete museums'
        }
      });
    }

    const museum = await Museum.findById(id);
    if (!museum) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MUSEUM_NOT_FOUND',
          message: 'Museum not found'
        }
      });
    }

    // Soft delete by adding deleted flag and timestamp
    museum.deleted = true;
    museum.deletedAt = new Date();
    museum.updatedAt = new Date();
    await museum.save();

    res.status(200).json({
      success: true,
      message: 'Museum deleted successfully'
    });

  } catch (error) {
    console.error('Delete museum error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MUSEUM_ID',
          message: 'Invalid museum ID format'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Get all museums with pagination, search, and filtering
 * @route   GET /api/museums
 * @access  Public
 */
exports.listMuseums = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      sortOrder = 'asc',
      location = '',
      allowRentals = ''
    } = req.query;

    // Build search query
    let searchQuery = { deleted: { $ne: true } }; // Exclude soft-deleted museums

    // Text search across name, location, and description
    if (search) {
      searchQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      searchQuery.location = { $regex: location, $options: 'i' };
    }

    // Rental settings filter
    if (allowRentals !== '') {
      searchQuery['settings.allowRentals'] = allowRentals === 'true';
    }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Execute query with pagination
    const [museums, totalCount] = await Promise.all([
      Museum.find(searchQuery)
        .populate('createdBy', 'name email')
        .select('-__v')
        .sort(sortObject)
        .skip(skip)
        .limit(limitNum),
      Museum.countDocuments(searchQuery)
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        museums,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: totalCount,
          limit: limitNum,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? parseInt(page) + 1 : null,
          prevPage: hasPrevPage ? parseInt(page) - 1 : null
        }
      }
    });

  } catch (error) {
    console.error('List museums error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Upload museum images
 * @route   POST /api/museums/:id/images
 * @access  Private (superAdmin, museumAdmin for own museum)
 */
exports.uploadMuseumImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the museum first
    const museum = await Museum.findById(id);
    if (!museum) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MUSEUM_NOT_FOUND',
          message: 'Museum not found'
        }
      });
    }

    // Check authorization
    if (req.user.role !== 'superAdmin') {
      if (req.user.role !== 'museumAdmin' || req.user.museum !== id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only upload images to your own museum'
          }
        });
      }
    }

    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILES',
          message: 'No image files uploaded'
        }
      });
    }

    // Process uploaded images
    const uploadedImages = req.files.map(file => ({
      url: `/uploads/museums/images/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      uploadedAt: new Date()
    }));

    // Update museum with new images (append to existing images)
    museum.images = museum.images || [];
    museum.images.push(...uploadedImages);
    museum.updatedAt = new Date();
    
    await museum.save();

    res.status(200).json({
      success: true,
      data: {
        uploadedImages,
        totalImages: museum.images.length
      },
      message: 'Images uploaded successfully'
    });

  } catch (error) {
    console.error('Upload museum images error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MUSEUM_ID',
          message: 'Invalid museum ID format'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Delete museum image
 * @route   DELETE /api/museums/:id/images/:imageId
 * @access  Private (superAdmin, museumAdmin for own museum)
 */
exports.deleteMuseumImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    // Find the museum first
    const museum = await Museum.findById(id);
    if (!museum) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MUSEUM_NOT_FOUND',
          message: 'Museum not found'
        }
      });
    }

    // Check authorization
    if (req.user.role !== 'superAdmin') {
      if (req.user.role !== 'museumAdmin' || req.user.museum !== id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only delete images from your own museum'
          }
        });
      }
    }

    // Find the image to delete
    const imageIndex = museum.images.findIndex(img => img._id.toString() === imageId);
    if (imageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'IMAGE_NOT_FOUND',
          message: 'Image not found'
        }
      });
    }

    const imageToDelete = museum.images[imageIndex];

    // Delete the physical file
    const imagePath = path.join(__dirname, '../../uploads/museums/images', imageToDelete.filename);
    try {
      await fs.unlink(imagePath);
    } catch (fileError) {
      console.warn('Could not delete physical file:', fileError.message);
      // Continue with database cleanup even if file deletion fails
    }

    // Remove image from museum record
    museum.images.splice(imageIndex, 1);
    museum.updatedAt = new Date();
    
    await museum.save();

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: {
        remainingImages: museum.images.length
      }
    });

  } catch (error) {
    console.error('Delete museum image error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid museum or image ID format'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};

/**
 * @desc    Get museum statistics
 * @route   GET /api/museums/:id/stats
 * @access  Private (superAdmin, museumAdmin for own museum, staff)
 */
exports.getMuseumStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the museum first
    const museum = await Museum.findById(id);
    if (!museum) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MUSEUM_NOT_FOUND',
          message: 'Museum not found'
        }
      });
    }

    // Check authorization
    if (req.user.role !== 'superAdmin') {
      if (req.user.role !== 'museumAdmin' || req.user.museum !== id) {
        if (req.user.role !== 'staff' || req.user.museum !== id) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'ACCESS_DENIED',
              message: 'You can only view statistics for your own museum'
            }
          });
        }
      }
    }

    // Get related statistics (using dynamic imports to avoid circular dependencies)
    const [
      Artifact,
      Event,
      Staff,
      RentalRequest
    ] = await Promise.all([
      require('../models/Artifact'),
      require('../models/Event'),
      require('../models/Staff'),
      require('../models/RentalRequest')
    ]);

    const [
      totalArtifacts,
      onDisplayArtifacts,
      featuredArtifacts,
      totalEvents,
      activeEvents,
      totalStaff,
      activeStaff,
      totalRentals,
      pendingRentals
    ] = await Promise.all([
      Artifact.countDocuments({ museum: id }),
      Artifact.countDocuments({ museum: id, status: 'on_display' }),
      Artifact.countDocuments({ museum: id, featured: true }),
      Event.countDocuments({ museum: id }),
      Event.countDocuments({ museum: id, status: 'active' }),
      Staff.countDocuments({ museum: id }),
      Staff.countDocuments({ museum: id, status: 'active' }),
      RentalRequest.countDocuments({ museum: id }),
      RentalRequest.countDocuments({ museum: id, status: 'pending' })
    ]);

    const stats = {
      artifacts: {
        total: totalArtifacts,
        onDisplay: onDisplayArtifacts,
        featured: featuredArtifacts,
        inStorage: totalArtifacts - onDisplayArtifacts
      },
      events: {
        total: totalEvents,
        active: activeEvents,
        completed: totalEvents - activeEvents
      },
      staff: {
        total: totalStaff,
        active: activeStaff,
        inactive: totalStaff - activeStaff
      },
      rentals: {
        total: totalRentals,
        pending: pendingRentals,
        processed: totalRentals - pendingRentals
      }
    };

    res.status(200).json({
      success: true,
      data: {
        museum: {
          id: museum._id,
          name: museum.name,
          location: museum.location
        },
        stats
      }
    });

  } catch (error) {
    console.error('Get museum stats error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_MUSEUM_ID',
          message: 'Invalid museum ID format'
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Internal server error'
      }
    });
  }
};
