
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
        title: {
            type: DataTypes.STRING(50),
            defaultValue: 0,
            allowNull: false
        },
        path: { // The path from the public directory to the 
            type: DataTypes.STRING(150),
            allowNull: false
        },
        playbackSpeed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        author_id: {
            type: DataTypes.INTEGER,
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