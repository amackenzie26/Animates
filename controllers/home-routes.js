const { Post } = require('../models');
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
        const projects = dbPostData.map(project => project.get({ plain: true}));
        res.render('homepage', { projects, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

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

//render one project to single project page
router.get('/project/:id', (req, res) => {
    Project.findOne({
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
        const project = dbPostData.get({ plain: true});

        //pass data to template
        res.render('single-project', { project, loggedIn: req.session.loggedIn});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;