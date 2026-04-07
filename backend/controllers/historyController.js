const { admin, db } = require('../config/firebase');

/**
 * Log an action to history
 * @param {string} entityType - 'package' or 'vehicle'
 * @param {string} action - 'create', 'update', or 'delete'
 * @param {string} itemId - Firestore document ID
 * @param {string} itemTitle - Title/name of the item
 * @param {string} imageUrl - Image URL snapshot
 * @param {object} user - User object from request (optional)
 */
const logHistory = async (entityType, action, itemId, itemTitle, imageUrl, user = null) => {
  try {
    const historyData = {
      entityType,
      action,
      itemId,
      itemTitle,
      imageUrl: imageUrl || null,
      adminId: user?.uid || null,
      adminEmail: user?.email || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('history').add(historyData);
    console.log(`✅ History logged: ${action} ${entityType} (${itemId})`);
  } catch (error) {
    console.error('History logging error:', error.message);
    // Don't throw - history logging failure shouldn't break main operation
  }
};

/**
 * Get history logs with pagination and filters
 */
const getHistoryLogs = async (req, res) => {
  try {
    const { 
      entityType, 
      action, 
      page = 1, 
      limit = 10 
    } = req.query;

    let query = db.collection('history').orderBy('timestamp', 'desc');

    // Apply filters
    if (entityType) {
      query = query.where('entityType', '==', entityType);
    }

    if (action) {
      query = query.where('action', '==', action);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);

    query = query.limitToLast(endIndex);

    const snapshot = await query.get();
    const logs = [];

    snapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Reverse to maintain descending order
    logs.reverse();

    // Get total count for pagination info
    const countSnapshot = await db.collection('history').count().get();
    const totalRecords = countSnapshot.data().count;

    res.json({
      logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords,
        hasNextPage: endIndex < totalRecords,
      },
    });
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch history', message: error.message });
  }
};

/**
 * Get history for a specific item
 */
const getItemHistory = async (req, res) => {
  try {
    const { entityType, itemId } = req.params;

    const snapshot = await db.collection('history')
      .where('entityType', '==', entityType)
      .where('itemId', '==', itemId)
      .orderBy('timestamp', 'desc')
      .get();

    const logs = [];
    snapshot.forEach((doc) => {
      logs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json({ logs });
  } catch (error) {
    console.error('Get item history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch item history', message: error.message });
  }
};

module.exports = {
  logHistory,
  getHistoryLogs,
  getItemHistory,
};
