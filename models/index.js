const User = require('./User');
const Post = require('./Post');
const Animation = require('./Animation');
const Comment = require('./Comment');

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

//a comment can only belong to one user
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
//a comment can only belong to one post
Comment.belongsTo(Post, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});
//a user can make many comments
User.hasMany(Comment, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
//a post has many comments
Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
})


module.exports = { User, Post, Animation, Comment };

