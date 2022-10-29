//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll, createCrypto, getById, editById, deleteById, buyCrypto, searchRefDATA, addUserToItem } = require('../services/itemServices');
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

cryptoController.get('/create', (req, res) => {
        res.render('create', {
                title: 'Create offer',
                user: req.user
        })
})

cryptoController.post('/create', async (req, res) => {
        const item = {
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                payment: req.body.payment,
                description: req.body.description,
                owner: req.user._id,
        }
        try {
                if (Object.values(req.body).some(x => !x)) {
                        throw new Error('All fields are required!')
                }

                const data = await createCrypto(item)
                res.redirect('/crypto/catalog')
        } catch (error) {
                res.render('create', {
                        errors: parseError(error),
                        //BODY
                        data,
                        user: req.user
                })
        }
});


cryptoController.get('/details/:id', async (req, res) => {
        const crypto = await getById(req.params.id)
        //isOwner is for edit and delete functionality
        crypto.isOwner = crypto.owner.toString() == (req.user?._id)?.toString();

        crypto.bayer = crypto.buyer.map(x => x.toString()).includes(req.user?._id.toString())
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
                res.redirect('/auth/login')
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
                res.redirect('/auth/login')
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


cryptoController.get('/buy/:id', async (req, res) => {
        const crypto = await getById(req.params.id)
        if (crypto.owner.toString() != (req.user?._id)?.toString()
                && crypto.buyer.map(x => x.toString()).includes((req.user?._id)?.toString()) == false) {
                try {
                        await buyCrypto(req.params.id, req.user._id);
                        res.redirect(`/crypto/details/${req.params.id}`)
                } catch (error) {
                        res.render('catalog', {
                                error: parseError(error),
                                crypto,
                                user: req.user
                        })
                }

        }
});





module.exports = cryptoController
