require("dotenv").config();
const server = require('./src/app.js');
const sequelize = require('./src/db.js');

const PORT = process.env.PORT || 5000;


sequelize.authenticate()
.then(() => ('✅ Conectado a PostgreSQL con Sequelize'))
.catch(err => console.error('❌ Error de conexión:', err));

// ✅ Conectar a la base y sincronizar modelos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });

/* server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */