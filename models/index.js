const User = require('./User');
const Post = require('./Post');
const Animation = require('./Animation');

User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Animation, {
    foreignKey: 'author-id'
});

Animation.belongsTo(User, {
    foreignKey: 'author_id',
    onDelete: 'CASCADE'
});

// Post.hasOne(Animation, {
//     foreignKey: 'animation_id'
// });

// Animation.belongsTo(Post, {
//     foreignKey: 'animation_id'
// });

module.exports = { User, Post, Animation };

