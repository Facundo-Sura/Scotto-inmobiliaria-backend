const { Router } = require('express');
const { getAllItems, addNewItem, updateItem, deleteItem, getItemById } = require('../controllers/subastasController');
const upload = require('../middleware/multerConfig');
const router = Router();

router.get('/', getAllItems)

router.get('/:id', getItemById);

router.post('/', upload.single('imagen'), addNewItem);

router.put('/:id', updateItem);

router.delete('/:id', deleteItem);

module.exports = router;