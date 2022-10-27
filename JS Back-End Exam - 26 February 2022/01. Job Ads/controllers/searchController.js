const getBySearch = require("../services/searchServices");
const getAllBySearch = require("../services/searchServices");
const searchController = require('express').Router()

searchController.get('/', async (req, res) => {
    // cryptos = await getAllBySearch(req.query.search, req.query.payment)

    res.render('search', {
        title: 'Search',
        user: req.user
    })
})

searchController.post('/', async (req, res) => {
    if (req.body.search == '') {
        res.redirect('/search')
    }
    const adsList = []
    const userData = await getBySearch(req.body.search)
    if (userData.length > 0) {
        userData[0].personalAds.map(x => adsList.push(x))
    }
    const hasAds = adsList.length > 0 ? true : false
    const hasSearch = true;

    res.render('search', {
        title: 'Search',
        user: req.user,
        adsList,
        hasAds,
        hasSearch
    })
})
module.exports = searchController