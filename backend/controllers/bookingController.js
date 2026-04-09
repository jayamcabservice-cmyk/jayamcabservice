const { admin, db } = require('../config/firebase');

const COLLECTIONS = ['booking_enquiries', 'package_enquiries', 'bookings'];

// Helper to reliably locate a document across separated collections
async function findBookingDoc(id) {
  for (const coll of COLLECTIONS) {
    const docRef = db.collection(coll).doc(id);
    const doc = await docRef.get();
    if (doc.exists) return { docRef, doc, collectionName: coll };
  }
  return null;
}

/**
 * Get all bookings with pagination and filters
 */
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, vehicleType } = req.query;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    let allResults = [];
    let totalRecords = 0;

    for (const coll of COLLECTIONS) {
      // 1. Accumulate total count across all collections
      const countSnapshot = await db.collection(coll).count().get();
      totalRecords += countSnapshot.data().count;

      // 2. Fetch top N newest docs from each collection separately
      let query = db.collection(coll).orderBy('createdAt', 'desc');

      if (status) query = query.where('status', '==', status);
      if (vehicleType && coll !== 'package_enquiries') {
        query = query.where('vehicleType', '==', vehicleType);
      }

      // Fetch enough to cover the desired page
      const snapshot = await query.limit(endIndex).get();
      
      snapshot.forEach((doc) => {
        allResults.push({ id: doc.id, ...doc.data() });
      });
    }

    // 3. Merge and Sort chronologically
    allResults.sort((a, b) => {
      const timeA = a.createdAt ? (a.createdAt._seconds || a.createdAt.seconds || 0) : 0;
      const timeB = b.createdAt ? (b.createdAt._seconds || b.createdAt.seconds || 0) : 0;
      return timeB - timeA; // Descending (newest first)
    });

    // 4. Apply precise pagination slice
    const paginatedBookings = allResults.slice(startIndex, endIndex);

    res.json({
      bookings: paginatedBookings,
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
    const found = await findBookingDoc(id);

    if (!found) return res.status(404).json({ error: 'Booking not found' });

    res.json({ id: found.doc.id, ...found.doc.data() });
  } catch (error) {
    console.error('Get booking error:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking', message: error.message });
  }
};

/**
 * Create new booking (public endpoint)
 */
const createBooking = async (req, res) => {
  try {
    const {
      customerName, phone, email, pickup, destination, travelDate,
      vehicleType, passengers, message, type, tripType,
      packageName, packagePrice, pricePerKm, estimatedKm, estimatedPrice,
    } = req.body;

    if (!customerName || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const bookingData = {
      customerName,
      phone,
      email: email || null,
      type: type || 'ride',
      tripType: tripType || 'oneWay',
      pickup: pickup || null,
      destination: destination || null,
      travelDate: travelDate || null,
      vehicleType: vehicleType || null,
      passengers: parseInt(passengers) || 1,
      pricePerKm: pricePerKm ? parseFloat(pricePerKm) : null,
      estimatedKm: estimatedKm ? parseInt(estimatedKm) : null,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : null,
      packageName: packageName || null,
      packagePrice: packagePrice ? parseFloat(packagePrice) : null,
      message: message || '',
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Route to appropriate collection natively!
    const targetCollection = type === 'package' ? 'package_enquiries' : 'booking_enquiries';
    const docRef = await db.collection(targetCollection).add(bookingData);

    const io = req.app.get('io');
    if (io) io.emit('data_updated', { entity: 'bookings' });

    res.status(201).json({
      message: 'Booking submitted successfully',
      id: docRef.id,
      collection: targetCollection,
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

    if (!status) return res.status(400).json({ error: 'Status is required' });

    const found = await findBookingDoc(id);
    if (!found) return res.status(404).json({ error: 'Booking not found' });

    await found.docRef.update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const io = req.app.get('io');
    if (io) io.emit('data_updated', { entity: 'bookings' });

    res.json({ message: 'Booking status updated successfully', id, status });
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

    const found = await findBookingDoc(id);
    if (!found) return res.status(404).json({ error: 'Booking not found' });

    delete updateData.createdAt;
    delete updateData.id;

    await found.docRef.update({
      ...updateData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const io = req.app.get('io');
    if (io) io.emit('data_updated', { entity: 'bookings' });

    res.json({ message: 'Booking updated successfully', id, ...updateData });
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

    const found = await findBookingDoc(id);
    if (!found) return res.status(404).json({ error: 'Booking not found' });

    await found.docRef.delete();

    const io = req.app.get('io');
    if (io) io.emit('data_updated', { entity: 'bookings' });

    res.json({ message: 'Booking deleted successfully', id });
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
