const { Inmobiliaria } = require('../models/inmobiliaria.js');

const getAllProperties = async (req, res) => {
  try {
    const propiedades = await Inmobiliaria.findAll();
    return res.status(200).json(propiedades);
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
    
    res.status(200).json(propiedad);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener la propiedad' });
  }
};

const addNewProperty = async (req, res) => {
  try {
    const nuevaPropiedad = await Inmobiliaria.create(req.body);
    res.status(201).json({ 
      message: "Propiedad creada exitosamente",
      propiedad: nuevaPropiedad 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Error al crear la propiedad', detalles: error.errors });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Inmobiliaria.update(req.body, {
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