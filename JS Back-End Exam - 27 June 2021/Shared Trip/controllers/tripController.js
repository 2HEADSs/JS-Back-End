//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll, createCrypto, getById, editById, deleteById, buyCrypto, searchRefDATA, addUserToItem } = require('../services/itemServices');
const { parseError } = require('../util/parser');
const { hasUser, isGuest } = require('../middlewares/guard')
const tripController = require('express').Router()


//guards


tripController.get('/', async (req, res) => {
        //take real cryptos from servicec and send
        // let crypto = []
        try {
                const allTrips = await getAll();
                console.log(allTrips);
                res.render('shared-trips', {
                        title: 'Shared Trips',
                        user: req.user,
                        allTrips
                        // crypto
                })
        } catch (error) {
                res.render('home', {
                        error: parseError(error),
                        user: req.user
                })
        }
})

tripController.get('/create', (req, res) => {
        res.render('trip-create', {
                title: 'Offer trip',
                user: req.user
        })
})

tripController.post('/create', async (req, res) => {
        //TODO OFER TRIP
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


tripController.get('/details/:id', async (req, res) => {
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

tripController.get('/edit/:id', async (req, res) => {
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

tripController.post('/edit/:id', async (req, res) => {
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


tripController.get('/delete/:id', async (req, res) => {
        const crypto = await getById(req.params.id)
        const isOwner = crypto.owner.toString() == (req.user?._id)?.toString();

        if (!isOwner) {
                return res.redirect(`/auth/login/`)
        }
        await deleteById(req.params.id)
        res.redirect('/crypto/catalog')
});


tripController.get('/buy/:id', isGuest(), async (req, res) => {
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





module.exports = tripController
