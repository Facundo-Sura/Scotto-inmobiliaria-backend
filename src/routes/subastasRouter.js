const { Router } = require('express');
const { getAllItems, addNewItem, updateItem, deleteItem, getItemById } = require('../controllers/subastasController');
const router = Router();

router.get('/', getAllItems)

router.get('/:id', getItemById);

router.post('/', addNewItem);

router.put('/:id', updateItem);

router.delete('/:id', deleteItem);

module.exports = router;