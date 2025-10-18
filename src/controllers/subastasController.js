const { Subasta } = require('../models/subasta');

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
    const nuevoItem = await Subasta.create(req.body);
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
    const [updated] = await Subasta.update(req.body, {
      where: { id }
    });

    if (!updated) {
      return res.status(404).json({ error: 'Item de la subasta no encontrado' });
    }

    const itemActualizado = await Subasta.findByPk(id);
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Error al actualizar el item de la subasta', detalles: error.errors });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
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