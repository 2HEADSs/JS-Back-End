const { isGuest } = require('../middlewares/guard');
const { createCrypto, getAll, getById, editById, deleteById } = require('../services/cryptoService');
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
});


cryptoController.get('/details/:id', async (req, res) => {
    const crypto = await getById(req.params.id)
    //isOwner is for edit and delete functionality
    crypto.isOwner = crypto.owner.toString() == (req.user?._id)?.toString();
    crypto.bayer = false;
    res.render('details', {
        title: 'Details Page',
        user: req.user,
        crypto,
    })
});

cryptoController.get('/edit/:id', async (req, res) => {
    //TODO guard for Owner
    const crypto = await getById(req.params.id)
    const isOwner = crypto.owner.toString() == (req.user?._id)?.toString();
    if (!isOwner) {
        res.redirect('/')
    }

    res.render('edit', {
        title: 'Edit Page',
        user: req.user,
        crypto,
    })
})

cryptoController.post('/edit/:id', async (req, res) => {
    //TODO guard for Owner
    const crypto = await getById(req.params.id)
    const isOwner = crypto.owner.toString() == (req.user?._id)?.toString();
    if (!isOwner) {
        res.redirect('/')
    }

    try {
        await editById(req.params.id, req.body)
        res.redirect(`/crypto/details/${req.params.id}`)
    } catch (error) {
        res.render('edit', {
            error: parseError(error),
            crypto,
            user: req.user
        })
    }
});


cryptoController.get('/delete/:id', async (req, res) => {
    const crypto = await getById(req.params.id)
    const isOwner = crypto.owner.toString() == (req.user?._id)?.toString();

    if (!isOwner) {
        return res.redirect(`/auth/login/`)
    }
    await deleteById(req.params.id)
    res.redirect('/crypto/catalog')
});




module.exports = cryptoController
