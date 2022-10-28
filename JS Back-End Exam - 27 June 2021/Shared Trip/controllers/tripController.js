//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll, createTrip, getById, editById, deleteById, buyCrypto, searchRefDATA, addUserToItem, getByIdWithOwnerAndBuddies, joinTrip, editSeats } = require('../services/itemServices');
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

tripController.get('/create',hasUser(), (req, res) => {
        res.render('trip-create', {
                title: 'Offer trip',
                user: req.user
        })
})

tripController.post('/create',hasUser(), async (req, res) => {

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
        const trip = await getByIdWithOwnerAndBuddies(req.params.id)


        trip.isOwner = trip.owner._id.toString() == (req.user?._id)?.toString();
        trip.hasSeats = trip.seats > 0 ? true : false


        trip.hasBuddies = trip.buddies.map(x => x._id.toString()).includes(req.user?._id.toString())
        const buddies = []
        trip.buddies.map(x => buddies.push(x.email))

        res.render('trip-details', {
                title: 'Details Trip',
                user: req.user,
                trip,
                buddies: buddies.join(', ')
        })
});

tripController.get('/edit/:id',hasUser(), async (req, res) => {
        //TODO guard for Owner
        const trip = await getById(req.params.id)
        const isOwner = trip.owner.toString() == (req.user?._id)?.toString();
        if (!isOwner) {
                res.redirect('/')
        }

        res.render('trip-edit', {
                title: 'Edit Trip',
                user: req.user,
                trip,
        })
})

tripController.post('/edit/:id',hasUser(), async (req, res) => {
        //TODO guard for Owner
        const trip = await getById(req.params.id)
        const isOwner = trip.owner.toString() == (req.user?._id)?.toString();
        if (!isOwner) {
                res.redirect('/auth/login')
        }

        try {
                await editById(req.params.id, req.body)
                res.redirect(`/catalog/details/${req.params.id}`)
        } catch (error) {
                res.render('trip-edit', {
                        errors: parseError(error),
                        title: 'Edit Trip',
                        trip,
                        user: req.user
                })
        }
});


tripController.get('/delete/:id',hasUser(), async (req, res) => {
        const trip = await getById(req.params.id)
        const isOwner = trip.owner.toString() == (req.user?._id)?.toString();

        if (!isOwner) {
                return res.redirect(`/`)
        }
        await deleteById(req.params.id)
        res.redirect('/catalog')
});


tripController.get('/join/:id',hasUser(), async (req, res) => {
        const trip = await getById(req.params.id)
        await editSeats(req.params.id)

        if (trip.owner.toString() != (req.user?._id)?.toString()
                && trip.buddies.map(x => x.toString()).includes((req.user?._id)?.toString()) == false && trip.seats > 0) {
                try {
                        await joinTrip(req.params.id, req.user._id);
                        res.redirect(`/catalog/details/${req.params.id}`)
                } catch (error) {
                        res.render('404', {
                                errors: parseError(error),
                                title: 'Error Page',
                                user: req.user
                        })
                }

        }
});





module.exports = tripController
