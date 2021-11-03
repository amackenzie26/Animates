const router = require('express').Router();
const uuid = require()
const fs = require('fs');
const {Animation, User} = require('../../models');

// GET all animations
router.get('/', async (req, res) => {
    try {
        const animations = await Animation.findAll({
            include: [{model: User}]
        });
        const animationsJSON = animations.map((animation) => {
            animation.get({plain: true});
        })
        res.status(200).json(animationsJSON);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET a given animation
router.get('/:id', async (req, res) => {
    try {
        const animation = await Animation.findByPk(req.params.id, {
            include: [{model: User}]
        });
        if(!animation) {
            res.status(404).json({response: `Animation of id ${req.params.id} not found`});
        }
        const animationJSON = animation.get({ plain:true });
        res.status(200).json(animationJSON);
    } catch (err) {
        res.status(500).json(err);
    }
})

// POST animation (given stringified JSON from view in body)


// PUT (update) animation

// DELETE animation