const { hasUser } = require("../middlewares/guard");
const getBySearch = require("../services/searchServices");
const searchController = require('express').Router()

searchController.get('/', hasUser(), async (req, res) => {

    res.render('search', {
        title: 'Search',
        user: req.user
    })
})

searchController.post('/', hasUser(), async (req, res) => {
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