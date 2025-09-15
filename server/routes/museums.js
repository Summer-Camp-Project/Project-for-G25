const express = require('express');
const router = express.Router();
const {
  createMuseum,
  getMuseum,
  updateMuseum,
  deleteMuseum,
  listMuseums,
  uploadMuseumImages,
  deleteMuseumImage,
  getMuseumStats
} = require('../controllers/museums');

// Middleware imports
const { auth: authenticate, authorize, requireMuseumAccess: checkMuseumAccess } = require('../middleware/auth');
const { 
  validateMuseum, 
  validateMuseumUpdate,
  validateObjectId,
  validatePagination 
} = require('../middleware/validation');

// File upload configuration
const { uploadMuseumImages: multerUpload } = require('../config/fileUpload');

/**
 * @desc    Create a new museum
 * @route   POST /api/museums
 * @access  Private (superAdmin, museumAdmin)
 */
router.post('/',
  authenticate,
  authorize(['superAdmin', 'museumAdmin']),
  validateMuseum,
  createMuseum
);

/**
 * @desc    Get all museums with pagination, search, and filtering
 * @route   GET /api/museums
 * @access  Public
 */
router.get('/',
  validatePagination,
  listMuseums
);

/**
 * @desc    Get single museum by ID
 * @route   GET /api/museums/:id
 * @access  Public
 */
router.get('/:id',
  validateObjectId('id', 'Museum ID'),
  getMuseum
);

/**
 * @desc    Update museum
 * @route   PUT /api/museums/:id
 * @access  Private (superAdmin, museumAdmin for own museum)
 */
router.put('/:id',
  authenticate,
  validateObjectId('id', 'Museum ID'),
  authorize(['superAdmin', 'museumAdmin']),
  validateMuseumUpdate,
  updateMuseum
);

/**
 * @desc    Delete museum (soft delete)
 * @route   DELETE /api/museums/:id
 * @access  Private (superAdmin only)
 */
router.delete('/:id',
  authenticate,
  validateObjectId('id', 'Museum ID'),
  authorize(['superAdmin']),
  deleteMuseum
);

/**
 * @desc    Upload museum images
 * @route   POST /api/museums/:id/images
 * @access  Private (superAdmin, museumAdmin for own museum)
 */
router.post('/:id/images',
  authenticate,
  validateObjectId('id', 'Museum ID'),
  authorize(['superAdmin', 'museumAdmin']),
  multerUpload.array('images', 10), // Allow up to 10 images
  uploadMuseumImages
);

/**
 * @desc    Delete museum image
 * @route   DELETE /api/museums/:id/images/:imageId
 * @access  Private (superAdmin, museumAdmin for own museum)
 */
router.delete('/:id/images/:imageId',
  authenticate,
  validateObjectId('id', 'Museum ID'),
  validateObjectId('imageId', 'Image ID'),
  authorize(['superAdmin', 'museumAdmin']),
  deleteMuseumImage
);

/**
 * @desc    Get museum statistics
 * @route   GET /api/museums/:id/stats
 * @access  Private (superAdmin, museumAdmin for own museum, staff)
 */
router.get('/:id/stats',
  authenticate,
  validateObjectId('id', 'Museum ID'),
  authorize(['superAdmin', 'museumAdmin', 'staff']),
  getMuseumStats
);

module.exports = router;
