const router = require ('express').Router();
const { User, Post, Comment } = require('../../models');
// const { rawAttributes } = require('../../models/User');


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
                attributes: ['id', 'username', 'description', 'date_created', 'user_id']
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
    try{
    console.log("this is our signup info")
    console.log(req.body)
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    //store user data during session
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.status(200).json(dbUserData);
        })
    })}
    catch(err){
        console.error(err)
        res.status(500).json(err);
    }
});
//LOG-IN for users and PW Validation
router.post('/login', async (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(dbUserData => {
        if(!dbUserData) {
            res.status(400).json({ message: 'No user with matching username.'})
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if(!validPassword) {
            res.status(400).json({ message: 'Inccorect password.' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'Login successful. '});
        });
    });
});

//LOG-OUT for User
router.post('/logout', (req, res) => {

    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(400).end();
    }
});

module.exports = router;
