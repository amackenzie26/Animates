const router = require('express').Router();
const { openFile, saveAnimation } = require('../../utils/save');
const { Animation, User } = require('../../models');

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
});

// POST animation (given stringified JSON from view in body)
router.post('/', async (req, res) => {
    try {
        if(!req.body.animationData || !req.body.author_id) {
            res.status(400).json({response: "Request body must contain animationData and author_id"});
        }
        const path = await saveAnimation(req.body.animationData);

        const animation = Animation.build({
            path: path,
            author_id: req.body.author_id
        });
        await animation.save();
        res.status(200).json({response: "New animation saved successfully."});
    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT (update) animation

// DELETE animation