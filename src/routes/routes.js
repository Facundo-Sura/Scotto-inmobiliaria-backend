const { Router } =  require('express');
const router = Router();

//rutas
const inmobiliariaRouter = require('./inmobiliariaRouter.js');
const martilleroRouter = require('./martilleroRouter.js');
const subastaRouter = require('./subastasRouter.js');

// Define your routes
router.get('/', (req, res) => {
  res.json({ message: 'Hola desde Express en Vercel!' });
});

//rutas de get
r/* outer.use('/inmobiliaria', inmobiliariaRouter);

router.use('/martillero', martilleroRouter);

router.use('/subastas', subastaRouter); */

module.exports = router;