const homeController = require('express').Router()

//TODO replace with real controller by assignment
homeController.get('/', (req, res) => {
    res.render('home', {
        //title is not nessaccery I made the templete with {{title}}
        title: 'Auction House',
        user: req.user
    })
})


module.exports = homeController
