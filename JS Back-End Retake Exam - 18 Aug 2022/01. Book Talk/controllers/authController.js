const { isGuest, hasUser } = require('../middlewares/guard');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router()

authController.get('/register', hasUser(), (req, res) => {
    // TODO replace with actual view
    res.render('register', {
        title: 'Register page'
    });
});

authController.post('/register', hasUser(), async (req, res) => {

    try {
        if (req.body.username == '' || req.body.email == '' || req.body.password == '') {
            throw new Error('All fields are required!')
        }
        if (req.body.password.length < 3) {
            throw new Error('Passwords must be at least 3 characters')
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match!')
        }
        const token = await register(req.body.email, req.body.username, req.body.password);

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

authController.get('/login', hasUser(), (req, res) => {
    // TODO replace with actual view

    res.render('login', {

    });
});

authController.post('/login', hasUser(), async (req, res) => {
    try {
        const token = await login(req.body.email, req.body.password);

        //add token to response
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);
        res.render('login', {
            errors,
        });
    }
});


authController.get('/logout', isGuest(), (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
});


module.exports = authController