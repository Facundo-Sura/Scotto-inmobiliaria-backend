const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Inmobiliaria = sequelize.define('Inmobiliaria', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // ✅ DEBE estar así
        primaryKey: true,
        allowNull: false
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
        validate: {
            notEmpty: {
                msg: 'La descripción es requerida'
            },
            len: {
                args: [10, 2000],
                msg: 'La descripción debe tener entre 10 y 2000 caracteres'
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
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La dirección es requerida'
            }
        }
    },
    tipo: {
        type: DataTypes.ENUM('casa', 'departamento', 'terreno', 'local'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['casa', 'departamento', 'terreno', 'local']],
                msg: 'Tipo de propiedad no válido'
            }
        }
    },
    operacion: {
        type: DataTypes.ENUM('venta', 'alquiler'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['venta', 'alquiler']],
                msg: 'Tipo de operación no válida'
            }
        }
    },
    habitaciones: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            isInt: {
                msg: 'Las habitaciones deben ser un número entero'
            },
            min: {
                args: [0],
                msg: 'Las habitaciones no pueden ser negativas'
            }
        }
    },
    metros: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        validate: {
            isInt: {
                msg: 'Los metros deben ser un número entero'
            },
            min: {
                args: [0],
                msg: 'Los metros no pueden ser negativos'
            }
        }
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // ✅ NUEVOS CAMPOS PARA MÚLTIPLES ARCHIVOS
    imagenes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    imagen_public_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    imagenes_public_ids: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    tipos_archivos: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
}, {
    tableName: 'inmobiliarias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Inmobiliaria;