const { getAll } = require('../services/cryptoService')
const getBySearch = require('../services/searchServices')

const searchController = require('express').Router()

searchController.get('/', async (req, res) => {
    const crypto = await getAll()
    res.render('search', {
        title: 'Search Page',
        user: req.user,
        crypto
    })
})

searchController.post('/', async (req, res) => {
    const crypto = await getBySearch(req.body.name, req.body.payment)
    res.render('search', {
        title: 'Search Page',
        user: req.user,
        crypto
    })
})
module.exports = searchController