const homeController = require('express').Router()

homeController.get('/', (req, res) => {
    res.render('home', {
        user: req.user
    })
})


module.exports = homeController
