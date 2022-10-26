const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');
const { isEmail } = require('validator')

const authController = require('express').Router()

authController.get('/register', (req, res) => {
    // TODO replace with actual view
    res.render('register', {
        title: 'Register Page'
    });
});

authController.post('/register', async (req, res) => {
    //TODO check if username and email are requirde
    try {
        if (!isEmail(req.body.email)) {
            throw new Error('Invalid email')
        }
        if (req.body.email == '' || req.body.password == '' || req.body.repass == '' || req.body.description == '') {
            throw new Error('All fields are required!')
        }
        if (req.body.password.length < 5) {
            throw new Error('Passwords must be minimum 5 characters')
        }
        if (req.body.password != req.body.repass) {
            throw new Error('Passwords don\'t match!')
        }
        const token = await register(req.body.email, req.body.description, req.body.password);

        //TODO check assignment to see if register create session
        res.cookie('token', token)
        res.redirect('/'); // TODO replace by assignment
    } catch (error) {
        const errors = parseError(error)
        //TODO add error display to actual template from assignment
        res.render('register', {
            title: 'Register page',
            error: errors,
            body: {
                username: req.body.username
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
        if (req.body.email == '' || req.body.password == ''){
            throw new Error('All fields are required')
        }
            const token = await login(req.body.email, req.body.password);
        //add token to response
        res.cookie('token', token);
        res.redirect('/');  // TODO replace with redirect  by assignment
    } catch (error) {
        //TODO add error display 
        const errors = parseError(error);
        res.render('login', {
            title: 'Login Page',
            error: errors,
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