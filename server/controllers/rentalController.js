const RentalRequest = require('../models/RentalRequest');
const Artifact = require('../models/Artifact');
const Museum = require('../models/Museum');
const User = require('../models/User');

// Generate unique request ID
const generateRequestId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `RR-${timestamp}-${random}`.toUpperCase();
};

// Create rental request
async function createRentalRequest(req, res) {
  try {
    const {
      requestType,
      artifactId,
      museumId,
      duration,
      startDate,
      endDate,
      rentalFee,
      currency = 'ETB',
      description,
      specialRequirements
    } = req.body;

    const requestedBy = req.user.id;

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

    // Create rental request
    const rentalRequest = new RentalRequest({
      requestId: generateRequestId(),
      requestType,
      artifact: artifactId,
      museum: museumId,
      requestedBy,
      rentalDetails: {
        duration,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rentalFee,
        currency
      },
      description,
      specialRequirements,
      approvals: [{
        approver: requestedBy,
        role: requestType === 'museum_to_super' ? 'museum_admin' : 'super_admin',
        status: 'pending'
      }]
    });

    await rentalRequest.save();

    // Populate the response
    await rentalRequest.populate([
      { path: 'artifact', select: 'name description images' },
      { path: 'museum', select: 'name location' },
      { path: 'requestedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Rental request created successfully',
      data: rentalRequest
    });

  } catch (error) {
    console.error('Create rental request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create rental request',
      error: error.message
    });
  }
}

// Get all rental requests with filtering
async function getAllRentalRequests(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      requestType,
      museumId,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (requestType) query.requestType = requestType;
    if (museumId) query.museum = museumId;
    if (userId) query.requestedBy = userId;

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [requests, total] = await Promise.all([
      RentalRequest.find(query)
        .populate('artifact', 'name description images')
        .populate('museum', 'name location')
        .populate('requestedBy', 'name email role')
        .populate('approvals.approver', 'name email role')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      RentalRequest.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        requests,
      pagination: {
          current: Number(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get rental requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental requests',
      error: error.message
    });
  }
}

// Get single rental request
async function getRentalRequest(req, res) {
  try {
    const { id } = req.params;

    const request = await RentalRequest.findById(id)
      .populate('artifact')
      .populate('museum')
      .populate('requestedBy', 'name email role')
      .populate('approvals.approver', 'name email role')
      .populate('messages.sender', 'name email role');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });

  } catch (error) {
    console.error('Get rental request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental request',
      error: error.message
    });
  }
}

// Approve/Reject rental request
async function updateRentalRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    const approverId = req.user.id;
    const approverRole = req.user.role;

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    // Add approval
    await request.addApproval(approverId, approverRole, status, comments);

    // Update overall status based on approvals
    if (status === 'approved') {
      // Check if all required approvals are received
      const requiredApprovals = request.requestType === 'museum_to_super'
        ? ['museum_admin', 'super_admin']
        : ['super_admin', 'museum_admin'];

      const receivedApprovals = request.approvals
        .filter(a => a.status === 'approved')
        .map(a => a.role);

      const hasAllApprovals = requiredApprovals.every(role =>
        receivedApprovals.includes(role)
      );

      if (hasAllApprovals) {
        request.status = 'approved';
      }
    } else if (status === 'rejected') {
      request.status = 'rejected';
    }

    await request.save();

    res.json({
      success: true,
      message: `Rental request ${status} successfully`,
      data: request
    });

  } catch (error) {
    console.error('Update rental request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update rental request status',
      error: error.message
    });
  }
}

// Add message to rental request
async function addRentalRequestMessage(req, res) {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    await request.addMessage(senderId, message);

    res.json({
      success: true,
      message: 'Message added successfully',
      data: request
    });

  } catch (error) {
    console.error('Add rental request message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add message',
      error: error.message
    });
  }
}

// Update payment status
async function updatePaymentStatus(req, res) {
  try {
    const { id } = req.params;
    const { paymentStatus, transactionId, paymentMethod } = req.body;

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    request.payment.status = paymentStatus;
    if (transactionId) request.payment.transactionId = transactionId;
    if (paymentMethod) request.payment.paymentMethod = paymentMethod;
    if (paymentStatus === 'paid') {
      request.payment.paidAt = new Date();
    }

    await request.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: request
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
}

// Update 3D integration status
async function update3DIntegrationStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, modelUrl, previewUrl } = req.body;

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    request.threeDIntegration.status = status;
    if (modelUrl) request.threeDIntegration.modelUrl = modelUrl;
    if (previewUrl) request.threeDIntegration.previewUrl = previewUrl;
    if (status === 'completed') {
      request.threeDIntegration.completedAt = new Date();
    }

    await request.save();

    res.json({
      success: true,
      message: '3D integration status updated successfully',
      data: request
    });

  } catch (error) {
    console.error('Update 3D integration status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update 3D integration status',
      error: error.message
    });
  }
}

// Update virtual museum integration
async function updateVirtualMuseumIntegration(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await RentalRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Rental request not found'
      });
    }

    request.virtualMuseum.status = status;
    if (status === 'added') {
      request.virtualMuseum.addedAt = new Date();
    } else if (status === 'removed') {
      request.virtualMuseum.removedAt = new Date();
    }

    await request.save();

    res.json({
      success: true,
      message: 'Virtual museum integration updated successfully',
      data: request
    });

  } catch (error) {
    console.error('Update virtual museum integration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update virtual museum integration',
      error: error.message
    });
  }
}

// Get rental statistics
async function getRentalStatistics(req, res) {
  try {
    const { timeRange = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const [
      totalRequests,
      pendingRequests,
      approvedRequests,
      completedRequests,
      totalRevenue,
      requestsByStatus,
      requestsByType
    ] = await Promise.all([
      RentalRequest.countDocuments(),
      RentalRequest.countDocuments({ status: 'pending' }),
      RentalRequest.countDocuments({ status: 'approved' }),
      RentalRequest.countDocuments({ status: 'completed' }),
      RentalRequest.aggregate([
        { $match: { 'payment.status': 'paid' } },
        { $group: { _id: null, total: { $sum: '$rentalDetails.rentalFee' } } }
      ]),
      RentalRequest.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      RentalRequest.aggregate([
        { $group: { _id: '$requestType', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalRequests,
          pendingRequests,
          approvedRequests,
          completedRequests,
          totalRevenue: totalRevenue[0]?.total || 0
        },
        distribution: {
          byStatus: requestsByStatus,
          byType: requestsByType
        }
      }
    });

  } catch (error) {
    console.error('Get rental statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rental statistics',
      error: error.message
    });
  }
}

module.exports = {
  createRentalRequest,
  getAllRentalRequests,
  getRentalRequest,
  updateRentalRequestStatus,
  addRentalRequestMessage,
  updatePaymentStatus,
  update3DIntegrationStatus,
  updateVirtualMuseumIntegration,
  getRentalStatistics
};