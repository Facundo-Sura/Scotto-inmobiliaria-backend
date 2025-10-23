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
    
    const itemsConImagenesCorregidas = items.map(item => {
      const itemData = item.toJSON();
      
      if (!itemData.imagenes || !Array.isArray(itemData.imagenes)) {
        itemData.imagenes = itemData.imagen ? [itemData.imagen] : [];
      }
      
      return itemData;
    });
    
    return res.status(200).json(itemsConImagenesCorregidas);
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
    const imagenesUrls = [];
    const imagenesPublicIds = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'subastas'
        });
        
        imagenesUrls.push(result.secure_url);
        imagenesPublicIds.push(result.public_id);
      }

      itemData.imagen = imagenesUrls[0];
      itemData.imagen_public_id = imagenesPublicIds[0];
      itemData.imagenes = imagenesUrls;
      itemData.imagenes_public_ids = imagenesPublicIds;
    }
    
    const nuevoItem = await Subasta.create(itemData);
    res.status(201).json({ 
      message: "Item de la subasta creado exitosamente",
      item: nuevoItem 
    });
  } catch (error) {
    console.error('Error:', error);
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
    
    const imagenesExistentes = itemActual.imagenes || [];
    const publicIdsExistentes = itemActual.imagenes_public_ids || [];

    if (req.files && req.files.length > 0) {
      const nuevasImagenesUrls = [...imagenesExistentes];
      const nuevosPublicIds = [...publicIdsExistentes];

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'subastas'
        });
        
        nuevasImagenesUrls.push(result.secure_url);
        nuevosPublicIds.push(result.public_id);
      }

      updateData.imagenes = nuevasImagenesUrls;
      updateData.imagenes_public_ids = nuevosPublicIds;
      
      if (nuevasImagenesUrls.length > 0) {
        updateData.imagen = nuevasImagenesUrls[0];
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

    if (item.imagen_public_id) {
      await cloudinary.uploader.destroy(item.imagen_public_id);
    }

    if (item.imagenes_public_ids && Array.isArray(item.imagenes_public_ids)) {
      for (const publicId of item.imagenes_public_ids) {
        await cloudinary.uploader.destroy(publicId);
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