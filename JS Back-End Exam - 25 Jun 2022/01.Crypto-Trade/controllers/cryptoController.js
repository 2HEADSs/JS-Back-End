const { isGuest } = require('../middlewares/guard');
const { createCrypto, getAll } = require('../services/cryptoService');
const { parseError } = require('../util/parser');
const cryptoController = require('express').Router()


//guards


cryptoController.get('/catalog', async (req, res) => {
    //take real cryptos from servicec and send
    let crypto = []
    try {
        crypto = await getAll();
        res.render('catalog', {
            title: 'Catalog Page',
            user: req.user,
            crypto
        })
    } catch (error) {
        res.render('home', {
            error: parseError(error),
            user: req.user
        })
    }
})

cryptoController.get('/create', isGuest(), (req, res) => {
    res.render('create', {
        title: 'Create offer',
        user: req.user
    })
})

cryptoController.post('/create', isGuest(), async (req, res) => {
    const crypto = {
        name: req.body.name,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        payment: req.body.payment,
        description: req.body.description,
        owner: req.user._id,
    }
    console.log(crypto);


    try {
        await createCrypto(crypto)
        res.redirect('/crypto/catalog')
    } catch (error) {
        res.render('create', {
            errors: parseError(error),
            //BODY
            body: crypto,
            user: req.user
        })
    }
})




module.exports = cryptoController
