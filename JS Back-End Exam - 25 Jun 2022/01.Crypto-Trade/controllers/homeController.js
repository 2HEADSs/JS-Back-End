const homeController = require('express').Router()

homeController.get('/', (req, res) => {
    res.render('home', {
        //title is not nessaccery I made the templete with {{title}}
        title: 'Home Page',
        user: req.user
    })
})


module.exports = homeController
