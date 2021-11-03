
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Animation extends Model {}

Animation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        uses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        path: { // The path from the public directory to the 
            type: DataTypes.STRING(150),
            allowNull: false
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'animation'
    });

module.exports = Animation;