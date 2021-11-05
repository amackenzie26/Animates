const router = require('express').Router();
const { openFile, saveAnimation, saveFile, deleteFile } = require('../../utils/save');
const { Animation, User } = require('../../models');
const path = require('path');
const { encode } = require('punycode');

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

// GET a given animation (svg)
router.get('/:id', async (req, res) => {
    try {
        const animation = await Animation.findByPk(req.params.id, {
            include: [{model: User}]
        });
        if(!animation) {
            res.status(404).json({response: `Animation of id ${req.params.id} not found`});
            return;
        }
        const animationJSON = animation.get({ plain:true });
        res.status(200).json(animationJSON);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/gif/:id', async (req, res) => {
    try {
        const animation = await Animation.findByPk(req.params.id);
        if(!animation) {
            res.status(404).json({response: "Animation not found"});
            return;
        }
        res.status(200).json({response: "Gif found", path: animation.path + ".gif"});
        
    } catch (err) {
        res.status(500).json(err);
    }
});

// POST animation (given stringified JSON from view in body)
router.post('/', async (req, res) => {
    console.log('starting animation post route');
    try {
        if(!req.body.animationData || !req.body.playbackSpeed || !req.body.title) {
            res.status(400).json({response: "Request body must contain animationData, playbackSpeed, and a title"});
            return;
        }
        console.log("saving post...");
        const path = await saveAnimation(req.body.animationData, req.body.playbackSpeed, req.body.width, req.body.height);
        console.log(path);
        console.log(req.session.user_id);
        const animation = Animation.build({
            path: path,
            title: req.body.title,
            playbackSpeed: req.body.playbackSpeed,
            author_id: req.session.user_id
        });
        await animation.save();
        res.status(200).json({response: "New animation saved successfully."});
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// PUT (update) animation
router.put('/:id', async (req, res) => {
    try {
        if(!req.body.animationData) {
            res.status(400).json({response: "Request body must contain animation data"});
            return;
        }
        const animation = await Animation.findByPk(req.params.id);
        if(!animation) {
            res.status(404).json({response: "Animation not found"});
            return;
        }
        // This will delete the file even if the save fails, which is potentially dangerous
        console.log(animation.path);
        await deleteFile(animation.path);
        const saveSuccessful = await saveFile(animation.path, req.body.animationData);
        if(!saveSuccessful) {
            throw Error('Save not successful');
        }
        res.status(200).json({response: "Animation updated successfully"});
        
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE animation
router.delete('/:id', async (req, res) => {
    try {
        const animation = await Animation.findByPk(req.params.id);
        if(!animation) {
            res.status(404).json({response: "animation not found"});
            return;
        }
        await deleteFile(animation.path);
        await animation.destroy();
        res.status(200).json({response: "Animation deleted successfully"});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;