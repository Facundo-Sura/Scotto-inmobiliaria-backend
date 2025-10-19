// Use "type: commonjs" in package.json to use CommonJS modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const router = require('./routes/routes.js');
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(router);


// Export the Express app
module.exports = app;