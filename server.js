require("dotenv").config();
const server = require('./src/app.js');
const sequelize = require('./src/db.js');

const PORT = process.env.PORT || 5000;

// Manejo mejorado de errores
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a PostgreSQL con Sequelize'))
  .catch(err => {
    console.error('❌ Error de conexión a la BD:', err.message);
    console.log('💡 Verifica tu DATABASE_URL y configuración SSL');
  });

// Sincronización con manejo de errores
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    server.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la BD:', err.message);
    console.log('💡 Posibles causas:');
    console.log('   - DATABASE_URL incorrecta');
    console.log('   - Problemas de SSL');
    console.log('   - Credenciales inválidas');
  });

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Excepción no capturada:', err);
});