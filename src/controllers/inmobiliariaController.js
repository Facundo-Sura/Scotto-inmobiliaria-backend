const getAllProperties = async (req, res) => {
  res.json({ message: "propiedades en venta, alquiler, terrenos" });
};

const getPropertyById = async (req, res) => {
  res.json({ message: `propiedad con id ${req.params.id}` });
}

const addNewProperty = async (req, res) => {
  res.json({ message: "propiedad creada" });
};

const updateProperty = async (req, res) => {
  res.json({ message: `propiedad con id ${req.params.id} actualizada` });
};

const deleteProperty = async (req, res) => {
  res.json({ message: `propiedad con id ${req.params.id} eliminada` });
};

module.exports = {
  getAllProperties,
  getPropertyById,
  addNewProperty,
  updateProperty,
  deleteProperty,
};
