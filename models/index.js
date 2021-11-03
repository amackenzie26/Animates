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

User.hasMany(Animation, {
    foreignKey: 'author-id'
});

Animation.belongsTo(User, {
    foreignKey: 'author_id',
    onDelete: 'CASCADE'
});

Project.hasOne(Animation, {
    foreignKey: 'animation_id'
});

Animation.belongsTo(Project, {
    foreignKey: 'animation_id'
});

module.exports = { User, Project, Animation };

