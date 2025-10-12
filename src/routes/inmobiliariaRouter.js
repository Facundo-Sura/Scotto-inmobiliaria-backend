const { Router } = require('express');
const { getAllProperties, addNewProperty, updateProperty, deleteProperty, getPropertyById } = require('../controllers/inmobiliariaController');
const router = Router();

router.get('/', getAllProperties);

router.get('/:id', getPropertyById);

router.post('/', addNewProperty);

router.put('/:id', updateProperty);

router.delete('/:id', deleteProperty);

module.exports = router;