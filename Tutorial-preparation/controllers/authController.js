const { body } = require('express-validator');
const { validationResult } = require('express-validator/src/validation-result');
const { isGuest } = require('../middlewares/guard');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router()

authController.get('/register', isGuest(), (req, res) => {
    res.render('register', {
        title: 'Register page'
    });
});

authController.post('/register', isGuest(),
    body('username')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
        .isAlphanumeric().withMessage('Username may contain only letters and numbers'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
        .isAlphanumeric().withMessage('Password may contain only letters and numbers'),
    async (req, res) => {

        try {
            //errors is array - express-validator
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors
            }
            if (req.body.password != req.body.repass) {
                throw new Error('Passwords don\'t match!')
            }
            const token = await register(req.body.username, req.body.password);

            res.cookie('token', token)
            res.redirect('/');
        } catch (error) {
            const errors = parseError(error)

            res.render('register', {
                title: 'Register page',
                errors,
                body: {
                    username: req.body.username
                }
            });
        }

    });

authController.get('/login', isGuest(), (req, res) => {
    res.render('login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        const token = await login(req.body.username, req.body.password);

        //add token to response
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
            body: {
                username: req.body.username
            }
        });
    }
});


authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authController