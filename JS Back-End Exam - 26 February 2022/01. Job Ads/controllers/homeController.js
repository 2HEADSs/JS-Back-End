const { getAll } = require('../services/AdServices')

const homeController = require('express').Router()

//TODO replace with real controller by assignment
homeController.get('/', async (req, res) => {
    const allAds = await getAll()
    const firstThree = allAds.slice(0, 3);
    let hasApplied = false
    if (allAds.length > 0) {
        hasApplied = true;
    }
    res.render('home', {
        //title is not nessaccery I made the templete with {{title}}
        title: 'Home Page',
        user: req.user,
        firstThree,
        hasApplied
    })
})


module.exports = homeController
