const { getAll } = require('../services/hotelService');

const homeController = require('express').Router()

//TODO replace with real controller by assignment
homeController.get('/', async (req, res) => {
    const hotels = await getAll()
        res.render('home', {
            //title is not nessaccery I made the templete with {{title}}
            title: 'Home Page',
            hotels
        })
});




module.exports = homeController
