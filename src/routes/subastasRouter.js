const { Router } = require('express');
const { getAllItems, addNewItem, updateItem, deleteItem, getItemById } = require('../controllers/subastasController');
const upload = require('../middleware/multerConfig');
const router = Router();

router.get('/', getAllItems)

router.get('/:id', getItemById);

router.post('/', upload.single('imagen'), addNewItem);

// AGREGAR upload.single('imagen') también para update
router.put('/:id', upload.single('imagen'), updateItem);

router.delete('/:id', deleteItem);

module.exports = router;