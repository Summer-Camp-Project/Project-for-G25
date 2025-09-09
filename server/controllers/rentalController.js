const Rental = require('../models/Rental');
const Artifact = require('../models/Artifact');
const Museum = require('../models/Museum');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create new rental request
exports.createRental = async (req, res) => {
  try {
    const {
      artifactId,
      museumId,
      renterInfo,
      rentalType,
      purpose,
      requestedDuration,
      location,
      pricing,
      insurance,
      conditions
    } = req.body;

    // Validate artifact exists
    const artifact = await Artifact.findById(artifactId);
    if (!artifact) {
      return res.status(404).json({
        success: false,
        message: 'Artifact not found'
      });
    }

    // Validate museum exists
    const museum = await Museum.findById(museumId);
    if (!museum) {
      return res.status(404).json({
        success: false,
        message: 'Museum not found'
      });
    }

    // Check if artifact is available for rental
    const existingRental = await Rental.findOne({
      artifact: artifactId,
      status: { $in: ['approved', 'confirmed', 'active', 'in_transit'] },
      $or: [
        {
          'requestedDuration.startDate': { $lte: new Date(requestedDuration.endDate) },
          'requestedDuration.endDate': { $gte: new Date(requestedDuration.startDate) }
        },
        {
          'actualDuration.startDate': { $lte: new Date(requestedDuration.endDate) },
          'actualDuration.endDate': { $gte: new Date(requestedDuration.startDate) }
        }
      ]
    });

    if (existingRental) {
      return res.status(400).json({
        success: false,
        message: 'Artifact is not available for the requested dates'
      });
    }

    // Create rental request
    const rentalData = {
      artifact: artifactId,
      museum: museumId,
      renter: req.user._id,
      renterInfo,
      rentalType,
      purpose,
      requestedDuration,
      location,
      pricing,
      insurance,
      conditions
    };

    const rental = new Rental(rentalData);
    await rental.save();

    // Add initial timeline entry
    await rental.addTimelineEntry('created', 'Rental request created', req.user._id);

    // Populate references for response
    await rental.populate([
      { path: 'artifact', select: 'name description images estimatedValue' },
      { path: 'museum', select: 'name location contactInfo' },
      { path: 'renter', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Rental request created successfully',
      data: rental
    });

  } catch (error) {
    console.error('Create rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rental request',
      error: error.message
    });
  }
};

// Get all rentals with filters
exports.getAllRentals = async (req, res) => {
  try {
    const {
      status,
      museumId,
      renterId,
      artifactId,
      approvalStatus,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (museumId) filter.museum = museumId;
    if (renterId) filter.renter = renterId;
    if (artifactId) filter.artifact = artifactId;

    // Approval status filter
    if (approvalStatus) {
      switch (approvalStatus) {
        case 'pending_museum':
          filter['approvals.museumAdmin.status'] = 'pending';
          break;
        case 'pending_super':
          filter['approvals.superAdmin.status'] = 'pending';
          break;
        case 'approved':
          filter.status = 'approved';
          break;
        case 'rejected':
          filter.status = 'rejected';
          break;
      }
    }

    // Role-based access control
    if (req.user) {
      if (req.user.role === 'museum_admin') {
        // Museum admin can only see rentals for their museums
        const userMuseums = await Museum.find({ admin: req.user._id });
        const museumIds = userMuseums.map(m => m._id);
        filter.museum = { $in: museumIds };
      } else if (req.user.role === 'visitor') {
        // Regular users can only see their own rental requests
        filter.renter = req.user._id;
      }
      // super_admin can see all rentals
    }

    const skip = (page - 1) * limit;
    
    const rentals = await Rental.find(filter)
      .populate('artifact', 'name description images estimatedValue')
      .populate('museum', 'name location contactInfo')
      .populate('renter', 'name email organization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Rental.countDocuments(filter);

    res.json({
      success: true,
      data: rentals,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: rentals.length,
        totalRecords: total
      }
    });

  } catch (error) {
    console.error('Get rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rentals',
      error: error.message
    });
  }
};

// Get rental by ID
exports.getRentalById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rental ID'
      });
    }

    const rental = await Rental.findById(id)
      .populate('artifact', 'name description images estimatedValue')
      .populate('museum', 'name location contactInfo admin')
      .populate('renter', 'name email organization')
      .populate('approvals.museumAdmin.approvedBy', 'name email')
      .populate('approvals.superAdmin.approvedBy', 'name email')
      .populate('timeline.user', 'name email')
      .populate('communications.from', 'name email')
      .populate('communications.to', 'name email');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Check access permissions
    if (req.user && req.user.role !== 'super_admin') {
      const hasAccess = 
        rental.renter.equals(req.user._id) || // Renter
        rental.museum.admin.equals(req.user._id) || // Museum admin
        req.user.role === 'admin'; // General admin

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: rental
    });

  } catch (error) {
    console.error('Get rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental',
      error: error.message
    });
  }
};

// Museum admin approval
exports.approveByMuseumAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments, conditions } = req.body;

    // Check if user is museum admin
    if (!req.user || req.user.role !== 'museum_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Museum admin privileges required.'
      });
    }

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Verify this admin manages the museum
    const museum = await Museum.findOne({ 
      _id: rental.museum,
      admin: req.user._id 
    });

    if (!museum) {
      return res.status(403).json({
        success: false,
        message: 'You can only approve rentals for your own museum'
      });
    }

    if (rental.approvals.museumAdmin.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This rental has already been processed by museum admin'
      });
    }

    // Approve by museum admin
    await rental.approveByMuseumAdmin(req.user._id, comments, conditions);

    await rental.populate([
      { path: 'artifact', select: 'name description images' },
      { path: 'museum', select: 'name location' },
      { path: 'renter', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Rental approved by museum admin',
      data: rental
    });

  } catch (error) {
    console.error('Museum admin approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve rental',
      error: error.message
    });
  }
};

// Reject by museum admin
exports.rejectByMuseumAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    if (!req.user || req.user.role !== 'museum_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Museum admin privileges required.'
      });
    }

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    const museum = await Museum.findOne({ 
      _id: rental.museum,
      admin: req.user._id 
    });

    if (!museum) {
      return res.status(403).json({
        success: false,
        message: 'You can only reject rentals for your own museum'
      });
    }

    if (rental.approvals.museumAdmin.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This rental has already been processed by museum admin'
      });
    }

    await rental.rejectByMuseumAdmin(req.user._id, comments);

    res.json({
      success: true,
      message: 'Rental rejected by museum admin',
      data: rental
    });

  } catch (error) {
    console.error('Museum admin rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject rental',
      error: error.message
    });
  }
};

// Super admin approval
exports.approveBySuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments, specialConditions } = req.body;

    if (!req.user || req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.'
      });
    }

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (rental.approvals.superAdmin.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This rental does not require super admin approval or has already been processed'
      });
    }

    await rental.approveBySuperAdmin(req.user._id, comments, specialConditions);

    await rental.populate([
      { path: 'artifact', select: 'name description images' },
      { path: 'museum', select: 'name location' },
      { path: 'renter', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: 'Rental approved by super admin',
      data: rental
    });

  } catch (error) {
    console.error('Super admin approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve rental',
      error: error.message
    });
  }
};

// Reject by super admin
exports.rejectBySuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body;

    if (!req.user || req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Super admin privileges required.'
      });
    }

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (rental.approvals.superAdmin.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This rental does not require super admin approval or has already been processed'
      });
    }

    await rental.rejectBySuperAdmin(req.user._id, comments);

    res.json({
      success: true,
      message: 'Rental rejected by super admin',
      data: rental
    });

  } catch (error) {
    console.error('Super admin rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject rental',
      error: error.message
    });
  }
};

// Update rental status
exports.updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = [
      'pending_review', 'approved', 'rejected', 'payment_pending', 
      'confirmed', 'in_transit', 'active', 'completed', 'overdue', 'cancelled'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Check permissions
    const hasPermission = 
      req.user.role === 'super_admin' ||
      (req.user.role === 'museum_admin' && rental.museum.admin?.equals(req.user._id));

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    rental.status = status;
    await rental.save();

    await rental.addTimelineEntry(`status_updated_${status}`, notes || `Status updated to ${status}`, req.user._id);

    res.json({
      success: true,
      message: 'Rental status updated successfully',
      data: rental
    });

  } catch (error) {
    console.error('Update rental status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rental status',
      error: error.message
    });
  }
};

// Add communication to rental
exports.addCommunication = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, type = 'message', recipientId } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Verify access
    const hasAccess = 
      rental.renter.equals(req.user._id) ||
      req.user.role === 'super_admin' ||
      (req.user.role === 'museum_admin' && rental.museum.admin?.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await rental.addCommunication(req.user._id, recipientId, message, type);

    res.json({
      success: true,
      message: 'Communication added successfully'
    });

  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add communication',
      error: error.message
    });
  }
};

// Get rental statistics
exports.getRentalStats = async (req, res) => {
  try {
    const { museumId } = req.query;

    let stats;
    if (museumId) {
      // Get stats for specific museum
      if (req.user.role === 'museum_admin') {
        const museum = await Museum.findOne({ _id: museumId, admin: req.user._id });
        if (!museum) {
          return res.status(403).json({
            success: false,
            message: 'Access denied'
          });
        }
      }
      stats = await Rental.getMuseumStats(museumId);
    } else {
      // Get platform-wide stats (super admin only)
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Super admin privileges required.'
        });
      }
      stats = await Rental.getPlatformStats();
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get rental stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental statistics',
      error: error.message
    });
  }
};

// Get pending approvals
exports.getPendingApprovals = async (req, res) => {
  try {
    let pendingRentals;

    if (req.user.role === 'museum_admin') {
      // Get rentals pending museum admin approval
      const userMuseums = await Museum.find({ admin: req.user._id });
      const museumIds = userMuseums.map(m => m._id);
      
      pendingRentals = await Rental.find({
        museum: { $in: museumIds },
        'approvals.museumAdmin.status': 'pending',
        status: 'pending_review'
      }).populate('artifact', 'name images')
        .populate('renter', 'name email');

    } else if (req.user.role === 'super_admin') {
      // Get rentals pending super admin approval
      pendingRentals = await Rental.findPendingSuperAdminApproval();
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: pendingRentals,
      count: pendingRentals.length
    });

  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending approvals',
      error: error.message
    });
  }
};

// Get overdue rentals
exports.getOverdueRentals = async (req, res) => {
  try {
    if (!['museum_admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let filter = {};
    if (req.user.role === 'museum_admin') {
      const userMuseums = await Museum.find({ admin: req.user._id });
      const museumIds = userMuseums.map(m => m._id);
      filter.museum = { $in: museumIds };
    }

    const overdueRentals = await Rental.findOverdue();
    
    // Filter by museum if museum admin
    const filteredRentals = req.user.role === 'museum_admin' 
      ? overdueRentals.filter(rental => filter.museum.$in.some(id => id.equals(rental.museum._id)))
      : overdueRentals;

    res.json({
      success: true,
      data: filteredRentals,
      count: filteredRentals.length
    });

  } catch (error) {
    console.error('Get overdue rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue rentals',
      error: error.message
    });
  }
};

// Alias methods for route compatibility
exports.getRental = exports.getRentalById;

// Additional methods expected by routes
exports.updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Check if user can update (renter or admin)
    const canUpdate = 
      rental.renter.equals(req.user._id) ||
      req.user.role === 'super_admin' ||
      (req.user.role === 'museum_admin' && rental.museum.admin?.equals(req.user._id));

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow updates if not yet approved
    if (rental.status !== 'pending_review') {
      return res.status(400).json({
        success: false,
        message: 'Can only update pending rental requests'
      });
    }

    const updatedRental = await Rental.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('artifact museum renter');

    await updatedRental.addTimelineEntry('updated', 'Rental request updated', req.user._id);

    res.json({
      success: true,
      message: 'Rental updated successfully',
      data: updatedRental
    });

  } catch (error) {
    console.error('Update rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rental',
      error: error.message
    });
  }
};

exports.cancelRental = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Check permissions
    const canCancel = 
      rental.renter.equals(req.user._id) ||
      req.user.role === 'super_admin' ||
      (req.user.role === 'museum_admin' && rental.museum.admin?.equals(req.user._id));

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    rental.status = 'cancelled';
    await rental.save();

    await rental.addTimelineEntry('cancelled', 'Rental request cancelled', req.user._id);

    res.json({
      success: true,
      message: 'Rental cancelled successfully',
      data: rental
    });

  } catch (error) {
    console.error('Cancel rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel rental',
      error: error.message
    });
  }
};

// Additional route methods that may be referenced
exports.escalateToSuperAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    if (req.user.role !== 'museum_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only museum admins can escalate rentals'
      });
    }

    await rental.escalateToSuperAdmin(req.user._id, reason);

    res.json({
      success: true,
      message: 'Rental escalated to super admin',
      data: rental
    });

  } catch (error) {
    console.error('Escalate rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to escalate rental',
      error: error.message
    });
  }
};

// Missing methods for routes compatibility
exports.getMuseumPendingRentals = async (req, res) => {
  try {
    const { museumId } = req.params;
    
    const pendingRentals = await Rental.find({
      museum: museumId,
      'approvals.museumAdmin.status': 'pending',
      status: 'pending_review'
    }).populate('artifact', 'name images')
      .populate('renter', 'name email');

    res.json({
      success: true,
      data: pendingRentals,
      count: pendingRentals.length
    });

  } catch (error) {
    console.error('Get museum pending rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch museum pending rentals',
      error: error.message
    });
  }
};

exports.getSuperAdminPendingRentals = async (req, res) => {
  try {
    const pendingRentals = await Rental.findPendingSuperAdminApproval();

    res.json({
      success: true,
      data: pendingRentals,
      count: pendingRentals.length
    });

  } catch (error) {
    console.error('Get super admin pending rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch super admin pending rentals',
      error: error.message
    });
  }
};

// Placeholder methods for additional route functionality
exports.activateRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    rental.status = 'active';
    rental.actualDuration.startDate = new Date();
    await rental.save();

    await rental.addTimelineEntry('activated', 'Rental activated', req.user._id);

    res.json({
      success: true,
      message: 'Rental activated successfully',
      data: rental
    });

  } catch (error) {
    console.error('Activate rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to activate rental',
      error: error.message
    });
  }
};

exports.completeRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    rental.status = 'completed';
    rental.actualDuration.endDate = new Date();
    await rental.save();

    await rental.addTimelineEntry('completed', 'Rental completed', req.user._id);

    res.json({
      success: true,
      message: 'Rental completed successfully',
      data: rental
    });

  } catch (error) {
    console.error('Complete rental error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete rental',
      error: error.message
    });
  }
};

exports.requestExtension = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Extension functionality not yet implemented'
  });
};

exports.addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, type = 'message' } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    await rental.addCommunication(req.user._id, null, message, type);

    res.json({
      success: true,
      message: 'Message added successfully'
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id)
      .populate('communications.from', 'name email')
      .populate('communications.to', 'name email');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    res.json({
      success: true,
      data: rental.communications
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
};

// Placeholder methods for document and other functionality
exports.uploadDocument = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Document upload functionality not yet implemented'
  });
};

exports.getDocuments = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Document retrieval functionality not yet implemented'
  });
};

exports.addConditionReport = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Condition report functionality not yet implemented'
  });
};

exports.getRentalTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    const rental = await Rental.findById(id)
      .populate('timeline.user', 'name email');

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    res.json({
      success: true,
      data: rental.timeline
    });

  } catch (error) {
    console.error('Get rental timeline error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental timeline',
      error: error.message
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    rental.pricing.paymentStatus = paymentStatus;
    await rental.save();

    await rental.addTimelineEntry('payment_updated', `Payment status updated to ${paymentStatus}`, req.user._id);

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: rental
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

exports.getUserRentals = async (req, res) => {
  try {
    const { userId } = req.params;

    const rentals = await Rental.find({ renter: userId })
      .populate('artifact', 'name images')
      .populate('museum', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rentals,
      count: rentals.length
    });

  } catch (error) {
    console.error('Get user rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user rentals',
      error: error.message
    });
  }
};

exports.getArtifactRentals = async (req, res) => {
  try {
    const { artifactId } = req.params;

    const rentals = await Rental.find({ artifact: artifactId })
      .populate('renter', 'name email')
      .populate('museum', 'name location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rentals,
      count: rentals.length
    });

  } catch (error) {
    console.error('Get artifact rentals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch artifact rentals',
      error: error.message
    });
  }
};

exports.addReview = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Review functionality not yet implemented'
  });
};
