const { Router } =  require('express');
const router = Router();

// Define your routes
router.get('/', (req, res) => {
  res.json({ message: 'Hola desde Express en Vercel!' });
});

//rutas de get
router.get('/inmobiliaria', (req, res) => {
  res.json({ message: 'propiedades' });
})

router.get('/martillero', (req, res) => {
  res.json({ message: 'vahiculos, motos y camiones' });
})

router.get('/subasta', (req, res) => {
  res.json({ message: 'subastas realizadas o a realizar' });
})

//rustas de post
router.post('/inmobiliaria', (req, res) => {
  res.json({ message: 'post de nuevas propiedades' });
});

router.post('/martillero', (req, res) => {
  res.json({ message: 'post para martillerro' });
})
 
router.post('/subasta', (req, res) => {
  res.json({ message: 'post para nueva subasta' });
})

module.exports = router;