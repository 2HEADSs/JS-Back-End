const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const { isEmail } = require('validator');
const { isGuest } = require('../middlewares/guard');

const authController = require('express').Router()

authController.get('/register', isGuest(), (req, res) => {
    res.render('register', {
        title: 'Register page'
    });
});

authController.post('/register', isGuest(), async (req, res) => {

    try {
        if (!isEmail(req.body.email)) {
            throw new Error('Invalid email')
        }


        if (req.body.email == '' || req.body.firstName == '' || req.body.lastName == '' || req.body.password == '' || req.body.repass == '') {
            throw new Error('All fields are required!')
        }
        if (req.body.password.length < 4) {
            throw new Error('Passwords don\'t match!')
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match!')
        }
        const token = await register(req.body.email, req.body.firstName, req.body.lastName, req.body.password);

        res.cookie('token', token)
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error)


        res.render('register', {
            title: 'Register page',
            errors,
            body: req.body
        });
    }

});

authController.get('/login', isGuest(), (req, res) => {
    // TODO replace with actual view

    res.render('login', {
        title: 'Login Page'
    });
});


authController.post('/login', isGuest(), async (req, res) => {
    try {

        const token = await login(req.body.email, req.body.password);

        //add token to response
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {

        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            errors,
            body: req.body.email
        });
    }
});


authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authController