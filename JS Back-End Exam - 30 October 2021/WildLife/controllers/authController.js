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
    //TODO check if username and email are requirde
    console.log(req.body);
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

        //TODO check assignment to see if register create session
        res.cookie('token', token)
        res.redirect('/'); // TODO replace by assignment
    } catch (error) {
        console.log(error);
        const errors = parseError(error)

        //TODO add error display to actual template from assignment
        res.render('register', {
            title: 'Register page',
            errors,
            body: req.body
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
            body: req.body.email
        });
    }
});


authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
})

module.exports = authController