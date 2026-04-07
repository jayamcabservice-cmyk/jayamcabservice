const { admin, db } = require('../config/firebase');
const { deleteFromCloudinary } = require('../utils/cloudinaryUtils');
const { logHistory } = require('./historyController');

/**
 * Get all packages with pagination
 */
const getAllPackages = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;

    // Simple query without orderBy to avoid index requirement
    let query = db.collection('packages');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }

    if (category) {
      query = query.where('category', '==', category);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    const snapshot = await query.limit(endIndex).get();
    const packages = [];

    snapshot.forEach((doc) => {
      packages.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      packages,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(packages.length / limit),
        totalRecords: packages.length,
        hasNextPage: endIndex < packages.length,
      },
    });
  } catch (error) {
    console.error('Get packages error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to fetch packages', message: error.message });
  }
};

/**
 * Get single package by ID
 */
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('packages').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error('Get package error:', error.message);
    res.status(500).json({ error: 'Failed to fetch package', message: error.message });
  }
};

/**
 * Create new package
 */
const createPackage = async (req, res) => {
  try {
    const {
      title,
      location,
      price,
      description,
      imageUrl,
      thumbnailUrl,
      publicId,
      category,
      emoji,
    } = req.body;

    // Validation
    if (!title || !location || !price || !imageUrl) {
      return res.status(400).json({ error: 'Title, location, price, and image are required' });
    }

    const packageData = {
      title,
      location,
      price: parseFloat(price),
      description: description || '',
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      publicId: publicId || null,
      category: category || 'general',
      emoji: emoji || '🗺️',
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('packages').add(packageData);

    // Log history
    await logHistory(
      'package',
      'create',
      docRef.id,
      title,
      imageUrl,
      req.user
    );

    res.status(201).json({
      message: 'Package created successfully',
      id: docRef.id,
      ...packageData,
    });
  } catch (error) {
    console.error('Create package error:', error.message);
    res.status(500).json({ error: 'Failed to create package', message: error.message });
  }
};

/**
 * Update package
 */
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      location,
      price,
      description,
      imageUrl,
      thumbnailUrl,
      publicId,
      category,
      emoji,
      status,
    } = req.body;

    const docRef = db.collection('packages').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (title !== undefined) updateData.title = title;
    if (location !== undefined) updateData.location = location;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (publicId !== undefined) updateData.publicId = publicId;
    if (category !== undefined) updateData.category = category;
    if (emoji !== undefined) updateData.emoji = emoji;
    if (status !== undefined) updateData.status = status;

    await docRef.update(updateData);

    // Log history
    await logHistory(
      'package',
      'update',
      id,
      title || doc.data().title,
      imageUrl || doc.data().imageUrl,
      req.user
    );

    res.json({
      message: 'Package updated successfully',
      id,
      ...updateData,
    });
  } catch (error) {
    console.error('Update package error:', error.message);
    res.status(500).json({ error: 'Failed to update package', message: error.message });
  }
};

/**
 * Delete package
 */
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('packages').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const packageData = doc.data();

    // Delete image from Cloudinary
    if (packageData.publicId) {
      await deleteFromCloudinary(packageData.publicId);
    }

    // Delete from Firestore
    await db.collection('packages').doc(id).delete();

    // Log history
    await logHistory(
      'package',
      'delete',
      id,
      packageData.title,
      packageData.imageUrl,
      req.user
    );

    res.json({
      message: 'Package deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete package error:', error.message);
    res.status(500).json({ error: 'Failed to delete package', message: error.message });
  }
};

module.exports = {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
