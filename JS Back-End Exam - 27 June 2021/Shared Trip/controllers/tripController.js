//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll, createTrip, getById, editById, deleteById, buyCrypto, searchRefDATA, addUserToItem } = require('../services/itemServices');
const { parseError } = require('../util/parser');
const { hasUser, isGuest } = require('../middlewares/guard');
const { updateUser } = require('../services/userService');
const tripController = require('express').Router()


//guards


tripController.get('/', async (req, res) => {
        //TODO render real trips
        // let crypto = []
        try {
                const allTrips = await getAll();
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

        const trip = {
                startPoint: req.body.startPoint,
                endPoint: req.body.endPoint,
                date: req.body.date,
                time: req.body.time,
                carImage: req.body.carImage,
                carBrand: req.body.carBrand,
                seats: req.body.seats,
                price: req.body.price,
                description: req.body.description,
                owner: req.user._id,
        }
        try {
                const createdTrip = await createTrip(trip)
                await updateUser(req.user._id, createdTrip._id)
                res.redirect('/catalog')
        } catch (error) {
                //TODO RETURN VALUE IF ERROR ON FORM
                res.render('trip-create', {
                        errors: parseError(error),
                        body: trip,
                        user: req.user
                })
        }
});


tripController.get('/details/:id', async (req, res) => {
        const trip = await getById(req.params.id)
        console.log(trip);
        // //isOwner is for edit and delete functionality
        // crypto.isOwner = crypto.owner.toString() == (req.user?._id)?.toString();

        // crypto.bayer = crypto.buyer.map(x => x.toString()).includes(req.user?._id.toString())
        res.render('trip-details', {
                title: 'Details Trip',
                user: req.user,
                trip
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
