const Martillero = require('../models/Martillero');

const getAllItems = async (req, res) => {
  try {
    const items = await Martillero.findAll();
    return res.status(200).json(items);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener los items' });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Martillero.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.status(200).json(item);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener el item' });
  }
}

const addNewItem = async (req, res) => {
  try {
    const nuevoItem = await Martillero.create(req.body);
    res.status(201).json({ 
      message: "Item creado exitosamente",
      item: nuevoItem 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ error: 'Error al crear el item', detalles: error.errors });
  }
};

const updateItem = async (req, res) => {
 try {
  const { id } = req.params;
  const [updated] = await Martillero.update(req.body, {
    where: { id }
  });

  if (!updated) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  const itemActualizado = await Martillero.findByPk(id);
  res.status(200).json({ 
    message: "Item actualizado exitosamente",
    item: itemActualizado 
  });
 } catch (error) {
  console.error('Error:', error);
  res.status(400).json({ error: 'Error al actualizar el item', detalles: error.errors });
 }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Martillero.destroy({
      where: { id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    res.status(200).json({ message: 'Item eliminado exitosamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al eliminar el item' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  addNewItem,
  updateItem,
  deleteItem,
};
