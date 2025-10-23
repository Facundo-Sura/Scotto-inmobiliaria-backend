const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    const folder = req.baseUrl.includes('martillero') ? 'martillero' : 
              req.baseUrl.includes('inmobiliaria') ? 'inmobiliaria' : 'subastas';
    
    const baseParams = {
      folder: isVideo ? `${folder}/videos` : `${folder}/images`,
      allowed_formats: isVideo 
        ? ['mp4', 'mov', 'avi', 'mkv', 'webm'] 
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      resource_type: isVideo ? 'video' : 'image'
    };
    
    // Solo aplicar transformaciones a imágenes
    if (!isVideo) {
      baseParams.transformation = [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ];
    }
    
    return baseParams;
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB para videos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen o video'), false);
    }
  }
});

module.exports = upload.array('archivos', 10);