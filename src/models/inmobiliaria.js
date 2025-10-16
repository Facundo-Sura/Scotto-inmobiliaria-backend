const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Inmobiliaria = sequelize.define('Inmobiliaria', {
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
    ciudad: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La ciudad es requerida'
            }
        }
    },
    provincia: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La provincia es requerida'
            }
        }
    },
    tipo: {
        type: DataTypes.ENUM('casa', 'departamento', 'terreno', 'local', 'oficina'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['casa', 'departamento', 'terreno', 'local', 'oficina']],
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
    banos: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                msg: 'Los baños deben ser un número entero'
            },
            min: {
                args: [0],
                msg: 'Los baños no pueden ser negativos'
            }
        }
    },
    metros: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
        allowNull: true,
        validate: {
            isUrl: {
                msg: 'La imagen debe ser una URL válida'
            }
        }
    },
    fecha_publicacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'inmobiliarias',
    timestamps: true, // Esto crea automáticamente created_at y updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Inmobiliaria;