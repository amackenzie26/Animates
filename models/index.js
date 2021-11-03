const User = require('./User');
const Project = require('./Project');
const Animation = require('./Animation');

User.hasMany(Project, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Project.belongsTo(User, {
    foreignKey: 'user_id'
});

Animation

module.exports = { User, Project, Animation };

