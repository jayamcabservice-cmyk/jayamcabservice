const { uploadToCloudinary } = require('../utils/cloudinaryUtils');

/**
 * Upload image to Cloudinary
 */
const uploadImage = async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'travel');

    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
};

module.exports = {
  uploadImage,
};
