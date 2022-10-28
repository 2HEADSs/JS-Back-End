const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const { isEmail } = require('validator')

const authController = require('express').Router()

authController.get('/register', (req, res) => {
    // TODO replace with actual view
    res.render('register', {
        title: 'Register page'
    });
});

authController.post('/register', async (req, res) => {

    try {
        if (!isEmail(req.body.email)) {
            throw new Error('Invalid email')
        }
        if (req.body.email == '' || req.body.password == '' || req.body.repass == '') {
            throw new Error('All fields are required!')
        }
        if (req.body.password.length < 4) {
            throw new Error('Passwords must be minimum 4 character')
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match!')
        }
        if (!req.body.gender) {
            throw new Error('Gender must be checked!')
        }
        const token = await register(req.body.email, req.body.password, req.body.gender);

        //TODO check assignment to see if register create session
        res.cookie('token', token)
        res.redirect('/'); // TODO replace by assignment
    } catch (error) {
        const errors = parseError(error)
        console.log(errors);
        //TODO add error display to actual template from assignment
        res.render('register', {
            title: 'Register page',
            errors,
            body: {
                email: req.body.email
            }
        });
    }

});

authController.get('/login', (req, res) => {
    // TODO replace with actual view

    res.render('login', {
        title: 'Login Page'
    });
});


authController.post('/login', async (req, res) => {
    try {
        // TODO check if ony username or email or both
        const token = await login(req.body.email, req.body.password);

        //add token to response
        res.cookie('token', token);
        res.redirect('/');  // TODO replace with redirect  by assignment
    } catch (error) {
        //TODO add error display 
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