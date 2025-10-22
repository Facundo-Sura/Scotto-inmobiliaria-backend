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
    return res.status(200).json(items);
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

    res.status(200).json(item);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener el item de la subasta' });
  }
}

const addNewItem = async (req, res) => {
  try {
    const itemData = { ...req.body };
    
    // Si hay un archivo subido, subirlo a Cloudinary
    if (req.file) {
      // Con multer-storage-cloudinary, la URL ya está disponible en req.file.path
      itemData.imagen = req.file.path;
      itemData.imagen_public_id = req.file.filename; // Esto será el public_id de Cloudinary
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
    
    // Buscar el item actual para obtener información de la imagen existente
    const itemActual = await Subasta.findByPk(id);
    if (!itemActual) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    const updateData = { ...req.body };
    
    // Si hay una nueva imagen subida
    if (req.file) {
      // Eliminar la imagen anterior de Cloudinary si existe
      if (itemActual.imagen_public_id) {
        await cloudinary.uploader.destroy(itemActual.imagen_public_id);
      }
      
      // Usar la nueva imagen de Cloudinary
      updateData.imagen = req.file.path;
      updateData.imagen_public_id = req.file.filename;
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