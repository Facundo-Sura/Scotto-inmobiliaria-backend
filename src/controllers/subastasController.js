const getAllItems = async (req, res) => {
  res.json({ message: "objetos a subastar" });
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