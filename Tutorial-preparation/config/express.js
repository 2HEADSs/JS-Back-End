const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('../middlewares/session');
const trimBody = require('../middlewares/trimBody');


module.exports = (app) => {
    const hbs = handlebars.create({
        extname: '.hbs'
    });

    //view engine attached to .hbs - extension
    //view ingine allow us to use render 
    app.engine('.hbs', hbs.engine);

    // app.set allow us not to write .hbs to everything - write only the name of template
    app.set('view engine', 'hbs');

    //set name for static 
    app.use('/static', express.static('static'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(session())
    //trimbody - trim username and password
    app.use(trimBody())
}