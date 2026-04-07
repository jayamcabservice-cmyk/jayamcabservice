const cloudinary = require('../config/cloudinary');

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} folder - Folder name in Cloudinary
 * @returns {Promise<{imageUrl: string, thumbnailUrl: string, publicId: string}>}
 */
const uploadToCloudinary = async (fileBuffer, folder = 'travel') => {
  try {
    // Convert buffer to base64
    const b64 = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:image/jpeg;base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    // Generate thumbnail URL (300x300 cropped)
    const thumbnailUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 300, height: 300, crop: 'fill' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      imageUrl: result.secure_url,
      thumbnailUrl: thumbnailUrl,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.warn('No publicId provided for deletion');
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary:', result.result);
  } catch (error) {
    console.error('Cloudinary deletion error:', error.message);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
