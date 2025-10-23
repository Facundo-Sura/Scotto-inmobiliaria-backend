const { Router } = require('express');
const { getAllProperties, addNewProperty, updateProperty, deleteProperty, getPropertyById } = require('../controllers/inmobiliariaController');
const upload = require('../middleware/multerConfig'); // ✅ USAR EL MISMO MULTER
const router = Router();

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', upload, addNewProperty); // ✅ AGREGAR UPLOAD
router.put('/:id', upload, updateProperty); // ✅ AGREGAR UPLOAD
router.delete('/:id', deleteProperty);

module.exports = router;