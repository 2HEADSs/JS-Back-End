const { parseError } = require('../util/parser');
const cryptoController = require('express').Router()

cryptoController.get('/catalog', (req,res)=> {
    res.render('catalog')   
})


module.exports = cryptoController
