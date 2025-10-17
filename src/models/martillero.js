const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Martillero = sequelize.define('Martillero', {
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
    desripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El tipo es requerido'
            },
            isIn: {
                args: [['subasta', 'venta', 'alquiler']],
                msg: 'El tipo debe ser "subasta", "venta" o "alquiler"'
            }
        }
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La marca es requerida'
            }
        }
    },
    precio: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: {
            isDecimal: {
                msg: 'El precio debe ser un número válido'
            },
            min: {
                args: [0],
                msg: 'El precio no puede ser negativo'
            }
        }
    },
    modelo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    anio: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    kilometraje: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    caracteristicas: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    tableName: 'martilleros',
    timestamps: true, // Esto crea automáticamente created_at y updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Martillero;