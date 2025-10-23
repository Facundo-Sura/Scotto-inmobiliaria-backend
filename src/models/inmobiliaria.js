const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');

const Inmobiliaria = sequelize.define('Inmobiliaria', {
    // ... tus campos existentes ...
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // ✅ AGREGAR ESTOS CAMPOS NUEVOS:
    imagenes: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('imagenes');
            try {
                if (!rawValue || rawValue === 'null' || rawValue === '""') {
                    return [];
                }
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            } catch (error) {
                console.error('Error parsing imagenes:', error);
                return [];
            }
        },
        set(value) {
            const arrayValue = Array.isArray(value) ? value : [];
            this.setDataValue('imagenes', JSON.stringify(arrayValue));
        }
    },
    imagen_public_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imagenes_public_ids: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('imagenes_public_ids');
            try {
                if (!rawValue || rawValue === 'null' || rawValue === '""') {
                    return [];
                }
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            } catch (error) {
                console.error('Error parsing imagenes_public_ids:', error);
                return [];
            }
        },
        set(value) {
            const arrayValue = Array.isArray(value) ? value : [];
            this.setDataValue('imagenes_public_ids', JSON.stringify(arrayValue));
        }
    },
    tipos_archivos: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        get() {
            const rawValue = this.getDataValue('tipos_archivos');
            try {
                if (!rawValue || rawValue === 'null' || rawValue === '""') {
                    return [];
                }
                return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
            } catch (error) {
                console.error('Error parsing tipos_archivos:', error);
                return [];
            }
        },
        set(value) {
            const arrayValue = Array.isArray(value) ? value : [];
            this.setDataValue('tipos_archivos', JSON.stringify(arrayValue));
        }
    }
}, {
    tableName: 'inmobiliarias',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Inmobiliaria;