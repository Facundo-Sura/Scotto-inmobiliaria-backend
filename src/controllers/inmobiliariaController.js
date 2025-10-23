const Inmobiliaria = require('../models/inmobiliaria.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllProperties = async (req, res) => {
  try {
    const propiedades = await Inmobiliaria.findAll();
    
    const propiedadesCorregidas = propiedades.map(propiedad => {
      const propiedadData = propiedad.toJSON();
      
      if (!propiedadData.imagenes || !Array.isArray(propiedadData.imagenes)) {
        propiedadData.imagenes = propiedadData.imagen ? [propiedadData.imagen] : [];
      }
      
      return propiedadData;
    });
    
    return res.status(200).json(propiedadesCorregidas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener las propiedades' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const propiedad = await Inmobiliaria.findByPk(id);
    
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    const propiedadData = propiedad.toJSON();
    
    if (!propiedadData.imagenes || !Array.isArray(propiedadData.imagenes)) {
      propiedadData.imagenes = propiedadData.imagen ? [propiedadData.imagen] : [];
    }
    
    res.status(200).json(propiedadData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener la propiedad' });
  }
};

const addNewProperty = async (req, res) => {
  try {
    console.log('📥 Request body:', req.body);
    console.log('📁 Request files:', req.files);
    
    const propiedadData = { ...req.body };
    const archivosUrls = [];
    const archivosPublicIds = [];
    const tiposArchivos = [];

    // ✅ VERIFICAR: ¿req.files existe? ¿O es req.file?
    if (req.files && req.files.length > 0) {
      console.log(`📸 Procesando ${req.files.length} archivos`);
      
      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/');
        const folder = 'inmobiliaria';
        
        const uploadOptions = {
          folder: isVideo ? `${folder}/videos` : `${folder}/images`,
          resource_type: isVideo ? 'video' : 'image'
        };

        console.log('Subiendo archivo:', file.originalname, file.mimetype);
        
        const result = await cloudinary.uploader.upload(file.path, uploadOptions);
        
        archivosUrls.push(result.secure_url);
        archivosPublicIds.push(result.public_id);
        tiposArchivos.push(isVideo ? 'video' : 'imagen');
      }

      propiedadData.imagen = archivosUrls[0];
      propiedadData.imagen_public_id = archivosPublicIds[0];
      propiedadData.imagenes = archivosUrls;
      propiedadData.imagenes_public_ids = archivosPublicIds;
      propiedadData.tipos_archivos = tiposArchivos;
    } else {
      console.log('ℹ️ No hay archivos en la request');
      // ✅ Asegurar que los campos de imágenes estén definidos
      propiedadData.imagen = null;
      propiedadData.imagenes = [];
      propiedadData.imagenes_public_ids = [];
      propiedadData.tipos_archivos = [];
    }

    // ✅ CONVERTIR campos numéricos - IMPORTANTE
    if (propiedadData.precio) propiedadData.precio = parseFloat(propiedadData.precio);
    if (propiedadData.metros) propiedadData.metros = parseInt(propiedadData.metros);
    if (propiedadData.habitaciones) propiedadData.habitaciones = parseInt(propiedadData.habitaciones);
    
    console.log('📊 Datos procesados para crear:', propiedadData);

    const nuevaPropiedad = await Inmobiliaria.create(propiedadData);
    
    console.log('✅ Propiedad creada exitosamente:', nuevaPropiedad.id);
    
    res.status(201).json({ 
      message: "Propiedad creada exitosamente",
      propiedad: nuevaPropiedad 
    });
  } catch (error) {
    console.error('❌ Error en addNewProperty:', error);
    
    // ✅ MOSTRAR errores de validación específicos
    if (error.name === 'SequelizeValidationError') {
      const errores = error.errors.map(err => ({
        campo: err.path,
        mensaje: err.message
      }));
      return res.status(400).json({ 
        error: 'Errores de validación', 
        detalles: errores 
      });
    }
    
    // Limpiar archivos subidos en caso de error
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const publicId = file.filename;
          await cloudinary.uploader.destroy(publicId, {
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image'
          });
        } catch (deleteError) {
          console.error('Error eliminando archivo de Cloudinary:', deleteError);
        }
      }
    }
    
    res.status(400).json({ 
      error: 'Error al crear la propiedad', 
      detalles: error.message 
    });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    
    const propiedadActual = await Inmobiliaria.findByPk(id);
    if (!propiedadActual) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    const updateData = { ...req.body };
    
    const archivosExistentes = propiedadActual.imagenes || [];
    const publicIdsExistentes = propiedadActual.imagenes_public_ids || [];
    const tiposExistentes = propiedadActual.tipos_archivos || [];

    if (req.files && req.files.length > 0) {
      const nuevosArchivosUrls = [...archivosExistentes];
      const nuevosPublicIds = [...publicIdsExistentes];
      const nuevosTipos = [...tiposExistentes];

      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/');
        const folder = 'inmobiliaria';
        
        const uploadOptions = {
          folder: isVideo ? `${folder}/videos` : `${folder}/images`,
          resource_type: isVideo ? 'video' : 'image'
        };

        const result = await cloudinary.uploader.upload(file.path, uploadOptions);
        
        nuevosArchivosUrls.push(result.secure_url);
        nuevosPublicIds.push(result.public_id);
        nuevosTipos.push(isVideo ? 'video' : 'imagen');
      }

      updateData.imagenes = nuevosArchivosUrls;
      updateData.imagenes_public_ids = nuevosPublicIds;
      updateData.tipos_archivos = nuevosTipos;
      
      if (nuevosArchivosUrls.length > 0) {
        updateData.imagen = nuevosArchivosUrls[0];
        updateData.imagen_public_id = nuevosPublicIds[0];
      }
    }

    // Convertir campos numéricos
    if (req.body.precio) updateData.precio = parseFloat(req.body.precio);
    if (req.body.habitaciones) updateData.habitaciones = parseInt(req.body.habitaciones);
    if (req.body.metros) updateData.metros = parseInt(req.body.metros);

    const [updated] = await Inmobiliaria.update(updateData, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    const propiedadActualizada = await Inmobiliaria.findByPk(id);
    res.status(200).json({ 
      message: "Propiedad actualizada exitosamente",
      propiedad: propiedadActualizada 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Error al actualizar la propiedad', detalles: error.errors });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propiedad = await Inmobiliaria.findByPk(id);
    
    if (!propiedad) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }

    // Eliminar archivos de Cloudinary
    if (propiedad.imagenes_public_ids && Array.isArray(propiedad.imagenes_public_ids)) {
      for (let i = 0; i < propiedad.imagenes_public_ids.length; i++) {
        const publicId = propiedad.imagenes_public_ids[i];
        const resourceType = propiedad.tipos_archivos && propiedad.tipos_archivos[i] === 'video' ? 'video' : 'image';
        
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType
        });
      }
    }

    const deleted = await Inmobiliaria.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Propiedad no encontrada' });
    }
    
    res.status(200).json({ message: "Propiedad eliminada exitosamente" });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar la propiedad' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  addNewProperty,
  updateProperty,
  deleteProperty,
};