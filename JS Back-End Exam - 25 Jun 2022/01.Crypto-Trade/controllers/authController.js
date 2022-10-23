const { hasUser, isGuest } = require('../middlewares/guard');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router()

authController.get('/register', hasUser(), (req, res) => {
    res.render('register', {
        title: 'Register page',
    });
});

authController.post('/register', hasUser(), async (req, res) => {

    try {
        if (req.body.email == '' || req.body.username == '' || req.body.password == '' || req.body.repass == '') {
            throw new Error('All fields are required!')
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match!')
        }
        if (req.body.password.length < 4) {
            throw new Error('Passwords must be at least 4 characters long!')
        }
        const token = await register(req.body.username, req.body.email, req.body.password);

        res.cookie('token', token)
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error)
        res.render('register', {
            title: 'Register page',
            errors,
        });
    }

});

authController.get('/login', hasUser(), (req, res) => {

    res.render('login', {
        title: 'Login Page',
    });
});

authController.post('/login', hasUser(), async (req, res) => {

    try {
        const token = await login(req.body.email, req.body.password);

        //add token to response
        res.cookie('token', token);
        res.redirect('/'); nt
    } catch (error) {
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
        });
    }
});


authController.get('/logout', isGuest(), (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authController