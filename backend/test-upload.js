const http = require('http');
const fs = require('fs');
const path = require('path');

async function testImageUpload() {
  try {
    console.log('\n=== Testing Image Upload ===');
    
    // Find a test image
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    const imageFile = files.find(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    
    if (!imageFile) {
      console.log('❌ No test images found in uploads folder');
      return;
    }
    
    const imagePath = path.join(uploadsDir, imageFile);
    console.log(`📁 Using image: ${imageFile}`);
    
    // Read the file
    const fileData = fs.readFileSync(imagePath);
    
    // Create multipart form data manually
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).slice(2);
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="image"; filename="${imageFile}"\r\n`),
      Buffer.from(`Content-Type: application/octet-stream\r\n\r\n`),
      fileData,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
    
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/upload',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length
      }
    };
    
    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.error) {
              console.log('❌ Upload failed:', response.error);
              reject(new Error(response.error));
            } else {
              console.log('✅ Upload successful!');
              console.log('Image URL:', response.imageUrl);
              console.log('Thumbnail URL:', response.thumbnailUrl);
              console.log('Public ID:', response.publicId);
              resolve(response);
            }
          } catch (e) {
            console.log('❌ Parse error:', e.message);
            console.log('Raw response:', data);
            reject(e);
          }
        });
      });
      
      req.on('error', reject);
      req.write(body);
      req.end();
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testImageUpload();
