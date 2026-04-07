const { admin, db } = require('../config/firebase');
const { deleteFromCloudinary } = require('../utils/cloudinaryUtils');
const { logHistory } = require('./historyController');

/**
 * Get all vehicles with pagination
 */
const getAllVehicles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;

    // Simple query without orderBy to avoid index requirement
    let query = db.collection('vehicles');

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
    const vehicles = [];

    snapshot.forEach((doc) => {
      vehicles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({
      vehicles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(vehicles.length / limit),
        totalRecords: vehicles.length,
        hasNextPage: endIndex < vehicles.length,
      },
    });
  } catch (error) {
    console.error('Get vehicles error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles', message: error.message });
  }
};

/**
 * Get single vehicle by ID
 */
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('vehicles').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error('Get vehicle error:', error.message);
    res.status(500).json({ error: 'Failed to fetch vehicle', message: error.message });
  }
};

/**
 * Create new vehicle
 */
const createVehicle = async (req, res) => {
  try {
    const {
      name,
      type,
      model,
      seating,
      luggage,
      pricePerKm,
      pricePerDay,
      description,
      imageUrl,
      thumbnailUrl,
      publicId,
      category,
    } = req.body;

    // Validation
    if (!name || !imageUrl) {
      return res.status(400).json({ error: 'Name and image are required' });
    }

    const vehicleData = {
      name,
      type: type || 'car',
      model: model || '',
      seating: seating || '',
      luggage: luggage || '',
      pricePerKm: pricePerKm || '',
      pricePerDay: pricePerDay ? parseFloat(pricePerDay) : null,
      description: description || '',
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      publicId: publicId || null,
      category: category || 'standard',
      status: 'available',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('vehicles').add(vehicleData);

    // Log history
    await logHistory(
      'vehicle',
      'create',
      docRef.id,
      name,
      imageUrl,
      req.user
    );

    res.status(201).json({
      message: 'Vehicle created successfully',
      id: docRef.id,
      ...vehicleData,
    });
  } catch (error) {
    console.error('Create vehicle error:', error.message);
    res.status(500).json({ error: 'Failed to create vehicle', message: error.message });
  }
};

/**
 * Update vehicle
 */
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      type,
      model,
      seating,
      luggage,
      pricePerKm,
      pricePerDay,
      description,
      imageUrl,
      thumbnailUrl,
      publicId,
      category,
      status,
    } = req.body;

    const docRef = db.collection('vehicles').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (model !== undefined) updateData.model = model;
    if (seating !== undefined) updateData.seating = seating;
    if (luggage !== undefined) updateData.luggage = luggage;
    if (pricePerKm !== undefined) updateData.pricePerKm = pricePerKm;
    if (pricePerDay !== undefined) updateData.pricePerDay = pricePerDay ? parseFloat(pricePerDay) : null;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (publicId !== undefined) updateData.publicId = publicId;
    if (category !== undefined) updateData.category = category;
    if (status !== undefined) updateData.status = status;

    await docRef.update(updateData);

    // Log history
    await logHistory(
      'vehicle',
      'update',
      id,
      name || doc.data().name,
      imageUrl || doc.data().imageUrl,
      req.user
    );

    res.json({
      message: 'Vehicle updated successfully',
      id,
      ...updateData,
    });
  } catch (error) {
    console.error('Update vehicle error:', error.message);
    res.status(500).json({ error: 'Failed to update vehicle', message: error.message });
  }
};

/**
 * Delete vehicle
 */
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('vehicles').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const vehicleData = doc.data();

    // Delete image from Cloudinary
    if (vehicleData.publicId) {
      await deleteFromCloudinary(vehicleData.publicId);
    }

    // Delete from Firestore
    await db.collection('vehicles').doc(id).delete();

    // Log history
    await logHistory(
      'vehicle',
      'delete',
      id,
      vehicleData.name,
      vehicleData.imageUrl,
      req.user
    );

    res.json({
      message: 'Vehicle deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete vehicle error:', error.message);
    res.status(500).json({ error: 'Failed to delete vehicle', message: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
