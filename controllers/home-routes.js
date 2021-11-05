const { Post, Animation, User } = require('../models');
const router = require('express').Router();
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'name',
            'description',
            'date_created'
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(project => project.get({ plain: true}));
        res.render('homepage', { posts, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Explore animations page
router.get('/explore', async (req, res) => {
    const animations = await Animation.findAll({
        include: [{model: User}]
    });

    const animationsJSON = animations.map(animation => animation.get({plain: true}));
    console.log(animationsJSON);
    res.render('explore', {
        loggedIn: req.session.loggedIn,
        animations: animationsJSON
    });
})

//redirect users to homepage after loggin in
router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

//render sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

//render one post to single post page
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name',
            'description',
            'date_created'
        ]
    })
    .then(dbPostData => {
        if(!dbPostData) {
            res.status(404).json({ message: 'No post found with matching id'});
            return;
        }

        //serialize
        const post = dbPostData.get({ plain: true});

        //pass data to template
        res.render('single-project', { post, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;