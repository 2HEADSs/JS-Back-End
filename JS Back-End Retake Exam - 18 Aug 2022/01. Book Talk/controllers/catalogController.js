const { getAll } = require('../services/bookServices');
const { parseError } = require('../util/parser');

const catalogController = require('express').Router();


catalogController.get('/', async (req, res) => {
    let books = []
    try {
        books = await getAll()
        res.render('catalog', { books, user: req.user })

    } catch (error) {
        res.render('home', {
            errors: parseError(error)
        })
    }

})



module.exports = catalogController