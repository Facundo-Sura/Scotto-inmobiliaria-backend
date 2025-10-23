const Subasta = require('../models/subasta');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllItems = async (req, res) => {
  try {
    const items = await Subasta.findAll();
    
    const itemsConArchivosCorregidos = items.map(item => {
      const itemData = item.toJSON();
      
      if (!itemData.imagenes || !Array.isArray(itemData.imagenes)) {
        itemData.imagenes = itemData.imagen ? [itemData.imagen] : [];
      }
      
      return itemData;
    });
    
    return res.status(200).json(itemsConArchivosCorregidos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener los items de la subasta' });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Subasta.findByPk(id);

    if (!item) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    const itemData = item.toJSON();
    
    if (!itemData.imagenes || !Array.isArray(itemData.imagenes)) {
      itemData.imagenes = itemData.imagen ? [itemData.imagen] : [];
    }

    res.status(200).json(itemData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener el item de la subasta' });
  }
}

const addNewItem = async (req, res) => {
  try {
    const itemData = { ...req.body };
    const archivosUrls = [];
    const archivosPublicIds = [];
    const tiposArchivos = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/');
        const folder = 'subastas';
        
        const uploadOptions = {
          folder: isVideo ? `${folder}/videos` : `${folder}/images`,
          resource_type: isVideo ? 'video' : 'image'
        };

        const result = await cloudinary.uploader.upload(file.path, uploadOptions);
        
        archivosUrls.push(result.secure_url);
        archivosPublicIds.push(result.public_id);
        tiposArchivos.push(isVideo ? 'video' : 'imagen');
      }

      itemData.imagen = archivosUrls[0];
      itemData.imagen_public_id = archivosPublicIds[0];
      itemData.imagenes = archivosUrls;
      itemData.imagenes_public_ids = archivosPublicIds;
      itemData.tipos_archivos = tiposArchivos;
    }
    
    const nuevoItem = await Subasta.create(itemData);
    res.status(201).json({ 
      message: "Item de la subasta creado exitosamente",
      item: nuevoItem 
    });
  } catch (error) {
    console.error('Error:', error);
    
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
    
    res.status(400).json({ error: 'Error al crear el item de la subasta', detalles: error.errors });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const itemActual = await Subasta.findByPk(id);
    if (!itemActual) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    const updateData = { ...req.body };
    
    const archivosExistentes = itemActual.imagenes || [];
    const publicIdsExistentes = itemActual.imagenes_public_ids || [];
    const tiposExistentes = itemActual.tipos_archivos || [];

    if (req.files && req.files.length > 0) {
      const nuevosArchivosUrls = [...archivosExistentes];
      const nuevosPublicIds = [...publicIdsExistentes];
      const nuevosTipos = [...tiposExistentes];

      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/');
        const folder = 'subastas';
        
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
    
    const [updated] = await Subasta.update(updateData, {
      where: { id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    const itemActualizado = await Subasta.findByPk(id);
    
    res.status(200).json({ 
      message: "Item de la subasta actualizado exitosamente",
      item: itemActualizado 
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Error al actualizar el item de la subasta', detalles: error.errors });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Subasta.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    // Eliminar archivos de Cloudinary
    if (item.imagenes_public_ids && Array.isArray(item.imagenes_public_ids)) {
      for (let i = 0; i < item.imagenes_public_ids.length; i++) {
        const publicId = item.imagenes_public_ids[i];
        const resourceType = item.tipos_archivos && item.tipos_archivos[i] === 'video' ? 'video' : 'image';
        
        await cloudinary.uploader.destroy(publicId, {
          resource_type: resourceType
        });
      }
    }

    const deleted = await Subasta.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    res.status(200).json({ message: 'Item de la subasta eliminado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar el item de la subasta' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  addNewItem,
  updateItem,
  deleteItem,
};