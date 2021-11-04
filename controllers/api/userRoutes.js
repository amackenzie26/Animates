const router = require ('express').Router();
const { User, Post, Comment } = require('../../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//GET /api/users for 'all' users
router.get('/', (req, res) => {
    //access user model with findAll
    User.findAll({
        attributes: { exclude: ['password']},
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET a single user by id '/api/users/:id'
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: require.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'name', 'description', 'date_created', 'user_id']
            }
        ]
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found with matching id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    });
});


//CREATE new User
router.post('/', async (req, res) => {
    try {
        console.log("starting post");
        const newPw = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = User.build( {
            name: req.body.name,
            email: req.body.email,
            password: newPw
        });
        await newUser.save();
        console.log('user saved');

        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            res.status(200).json(newUser);
        });
        console.log('session saved');
    } catch (err) {
        res.status(500).json(err);
    }
});


//LOG-IN for users and PW Validation
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({ where: {
            email: req.body.email 
        }});

        if (!userData) {
            res
            .status(400)
            .json({ message: 'Incorrect email, please try again'});
            return;
        }

        const validPassword = await userData.checkPassword(req.body.password);

        if (!validPassword) {
            res
            .status(400)
            .json ({ message: 'Incorrect email or password, please try again'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'You are logged in!'});
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

//LOG-OUT for User
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).logged_in();
        });
    } else {
        res.status(400).end();
    }
});

module.exports = router;
