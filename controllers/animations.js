const router = require('express').Router();
const { response } = require('express');
const { Animation } = require('../models');

router.get('/create', async (req, res) => {
    try {
    res.render('create-animation', {
        loggedIn: req.session.loggedIn
    });
    } catch (err) {
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const animation = await Animation.findByPk(req.params.id);
        const animationJSON = await animation.get({ plain: true });
        res.render('animation', {
            loggedIn: req.session.loggedIn,
            animation: animationJSON
        });
    } catch (err) {
        console.log(err);
    }
});



module.exports = router;