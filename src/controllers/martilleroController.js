const getAllItems = async (req, res) => {
  try {
    const items = await items.findAll();

    return res.status(200).json(items);
  } catch (error) {
    res.status%(500).json({ error: 'Error al obtener los items' });
  }
  // res.json({ message: "vehiculos, muebles, etcetera" });
};

const getItemById = async (req, res) => {
  res.json({ message: `objeto con id ${req.params.id}` });
}

const addNewItem = async (req, res) => {
  res.json({ message: "martillero creado" });
};

const updateItem = async (req, res) => {
  res.json({ message: `martillero con id ${req.params.id} actualizado` });
};

const deleteItem = async (req, res) => {
  res.json({ message: `martillero con id ${req.params.id} eliminado` });
};

module.exports = {
  getAllItems,
  getItemById,
  addNewItem,
  updateItem,
  deleteItem,
};
