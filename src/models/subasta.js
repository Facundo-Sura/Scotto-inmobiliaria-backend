const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Subasta = sequelize.define('Subasta', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El título es requerido'
            },
            len: {
                args: [5, 255],
                msg: 'El título debe tener entre 5 y 255 caracteres'
            }
        }
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imagen_public_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID público de la imagen en Cloudinary para gestión'
    },
    inicioFecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    finFecha: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: {
                msg: 'La fecha de fin debe ser una fecha válida'
            },
            isAfter: {
                args: new Date(),
                msg: 'La fecha de fin debe ser una fecha futura'
            }
        }
    },
    precioInicial: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    precioActual: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'El precio actual debe ser un número válido'
            },
            min: {
                args: [0],
                msg: 'El precio actual no puede ser negativo'
            }
        }
    },
    estado: {
        type: DataTypes.ENUM('activa', 'proximamente', 'finalizada'),
        allowNull: false,
        defaultValue: 'proximamente',
    },
    categoria: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ofertas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    }
},{
    tableName: 'subastas',
    timestamps: true, // Esto crea automáticamente created_at y updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = Subasta;