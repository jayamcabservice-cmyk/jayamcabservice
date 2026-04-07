const { admin, db } = require('../config/firebase');

/**
 * Get all bookings with pagination and filters
 */
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, vehicleType } = req.query;

    let query = db.collection('bookings').orderBy('createdAt', 'desc');

    // Apply filters
    if (status) {
      query = query.where('status', '==', status);
    }

    if (vehicleType) {
      query = query.where('vehicleType', '==', vehicleType);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    query = query.limitToLast(endIndex);

    const snapshot = await query.get();
    const bookings = [];

    snapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Reverse to maintain descending order
    bookings.reverse();

    // Get total count
    const countSnapshot = await db.collection('bookings').count().get();
    const totalRecords = countSnapshot.data().count;

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        hasNextPage: endIndex < totalRecords,
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error.message);
    res.status(500).json({ error: 'Failed to fetch bookings', message: error.message });
  }
};

/**
 * Get single booking by ID
 */
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await db.collection('bookings').doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking', message: error.message });
  }
};

/**
 * Create new booking (public endpoint - no auth required)
 */
const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      pickup,
      destination,
      travelDate,
      vehicleType,
      passengers,
      message,
      // New fields
      type,           // 'ride' | 'package'
      tripType,       // 'oneWay' | 'roundTrip' | 'local'
      packageName,
      packagePrice,
      pricePerKm,
      estimatedKm,
      estimatedPrice,
    } = req.body;

    // Validation
    if (!customerName || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const bookingData = {
      customerName,
      phone,
      email: email || null,
      type: type || 'ride',
      tripType: tripType || 'oneWay',
      // Ride fields
      pickup: pickup || null,
      destination: destination || null,
      travelDate: travelDate || null,
      vehicleType: vehicleType || null,
      passengers: parseInt(passengers) || 1,
      pricePerKm: pricePerKm ? parseFloat(pricePerKm) : null,
      estimatedKm: estimatedKm ? parseInt(estimatedKm) : null,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
      // Package fields
      packageName: packageName || null,
      packagePrice: packagePrice ? parseFloat(packagePrice) : null,
      // General
      message: message || '',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('bookings').add(bookingData);

    res.status(201).json({
      message: 'Booking submitted successfully',
      id: docRef.id,
      ...bookingData,
    });
  } catch (error) {
    console.error('Create booking error:', error.message);
    res.status(500).json({ error: 'Failed to create booking', message: error.message });
  }
};

/**
 * Update booking status
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const docRef = db.collection('bookings').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await docRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      message: 'Booking status updated successfully',
      id,
      status,
    });
  } catch (error) {
    console.error('Update booking error:', error.message);
    res.status(500).json({ error: 'Failed to update booking', message: error.message });
  }
};

/**
 * Update booking (full update)
 */
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const docRef = db.collection('bookings').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Remove immutable fields
    delete updateData.createdAt;
    delete updateData.id;

    await docRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({
      message: 'Booking updated successfully',
      id,
      ...updateData,
    });
  } catch (error) {
    console.error('Update booking error:', error.message);
    res.status(500).json({ error: 'Failed to update booking', message: error.message });
  }
};

/**
 * Delete booking
 */
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('bookings').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await docRef.delete();

    res.json({
      message: 'Booking deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Delete booking error:', error.message);
    res.status(500).json({ error: 'Failed to delete booking', message: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
};
