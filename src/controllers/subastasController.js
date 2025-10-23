const Subasta = require('../models/subasta');
const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary (debes tener esto en tu archivo de configuración o aquí)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const getAllItems = async (req, res) => {
  try {
    const items = await Subasta.findAll();
    
    // ✅ CORRECCIÓN: Asegurar que las imágenes sean arrays válidos
    const itemsConImagenesCorregidas = items.map(item => {
      const itemData = item.toJSON();
      
      // Si no hay campo imagenes, crear uno basado en la imagen principal
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

    // ✅ CORRECCIÓN: Asegurar que las imágenes sean arrays válidos
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

    // Si hay archivos subidos
    if (req.files && req.files.length > 0) {
      // Subir todas las imágenes a Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'subastas'
        });
        
        imagenesUrls.push(result.secure_url);
        imagenesPublicIds.push(result.public_id);
      }

      // La primera imagen es la principal
      itemData.imagen = imagenesUrls[0];
      itemData.imagen_public_id = imagenesPublicIds[0];
      
      // Todas las imágenes
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
    const nuevasImagenesUrls = [...(itemActual.imagenes || [])];
    const nuevasImagenesPublicIds = [...(itemActual.imagenes_public_ids || [])];

    // Si hay nuevas imágenes subidas
    if (req.files && req.files.length > 0) {
      // Subir nuevas imágenes a Cloudinary
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'subastas'
        });
        
        nuevasImagenesUrls.push(result.secure_url);
        nuevasImagenesPublicIds.push(result.public_id);
      }

      // Si hay nuevas imágenes, la primera se convierte en la principal
      updateData.imagen = nuevasImagenesUrls[0];
      updateData.imagen_public_id = nuevasImagenesPublicIds[0];
      updateData.imagenes = nuevasImagenesUrls;
      updateData.imagenes_public_ids = nuevasImagenesPublicIds;
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
    
    // Buscar el item para obtener información de la imagen en Cloudinary
    const item = await Subasta.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    // Eliminar la imagen de Cloudinary si existe
    if (item.imagen_public_id) {
      await cloudinary.uploader.destroy(item.imagen_public_id);
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