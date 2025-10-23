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
    imagenes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('imagenes');
            try {
                // ✅ CORRECCIÓN: Manejar casos null, undefined o string vacío
                if (!rawValue || rawValue === 'null' || rawValue === '""') {
                    return [];
                }
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            } catch (error) {
                console.error('Error parsing imagenes:', error);
                return []; // Retornar array vacío en caso de error
            }
        },
        set(value) {
            // ✅ CORRECCIÓN: Asegurar que siempre sea un array válido
            const arrayValue = Array.isArray(value) ? value : [];
            this.setDataValue('imagenes', JSON.stringify(arrayValue));
        }
    },
    imagen_public_id: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'ID público de la imagen principal en Cloudinary'
    },
    imagenes_public_ids: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('imagenes_public_ids');
            try {
                // ✅ CORRECCIÓN: Manejar casos null, undefined o string vacío
                if (!rawValue || rawValue === 'null' || rawValue === '""') {
                    return [];
                }
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            } catch (error) {
                console.error('Error parsing imagenes_public_ids:', error);
                return []; // Retornar array vacío en caso de error
            }
        },
        set(value) {
            // ✅ CORRECCIÓN: Asegurar que siempre sea un array válido
            const arrayValue = Array.isArray(value) ? value : [];
            this.setDataValue('imagenes_public_ids', JSON.stringify(arrayValue));
        }
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Subasta;