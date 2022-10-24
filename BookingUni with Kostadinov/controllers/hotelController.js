const { create, getById, update, deleteById, bookRoom } = require('../services/hotelService');
const { parseError } = require('../util/parser');


const hotelController = require('express').Router();

hotelController.get('/:id/details', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner == req.user._id) {
        hotel.isOwner = true;
    } else if (hotel.bookings.map(b => b.toString()).includes(req.user._id.toString())) {
        hotel.isBooked = true;
    }

    res.render('details', {
        title: 'Hotel Details',
        hotel
    });
});

hotelController.get('/create', (req, res) => {
    res.render('create', {
        titel: 'Create hotel'
    });
});

hotelController.post('/create', async (req, res) => {
    const hotel = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: Number(req.body.rooms),
        owner: req.user._id,
    }



    try {
        //check if the is some empty field
        if (Object.values(hotel).some(x => !x)) {
            throw new Error('All fields are required!')
        }

        const result = await create(hotel)
        res.redirect('/')
    } catch (error) {
        res.render('create', {
            title: 'Create hotel',
            body: hotel,
            errors: parseError(error)
        });
    }
});

hotelController.get('/:id/edit', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner != req.user._id) {
        return res.redirect('/auth/login')
    }
    res.render('edit', {
        titel: 'Edit Hotel',
        hotel
    });
});

hotelController.post('/:id/edit', async (req, res) => {
    const hotel = await getById(req.params.id)
    if (hotel.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    const edited = {
        name: req.body.name,
        city: req.body.city,
        imageUrl: req.body.imageUrl,
        rooms: Number(req.body.rooms),
    }



    try {
        //check if the is some empty field
        if (Object.values(edited).some(x => !x)) {
            throw new Error('All fields are required!')
        }
        
        if (edited.rooms > 100) {
            throw new Error('Rooms must be between 1 and 100')
        }

        if (edited.rooms < 1) {
    throw new Error('Rooms must be between 1 and 100')
}

const result = await update(req.params.id, edited)
res.redirect(`/hotel/${req.params.id}/details`)
    } catch (error) {
    res.render('edit', {
        title: 'Edit hotel',
        hotel: Object.assign(edited, { _id: req.params.id }),
        errors: parseError(error)
    });
}
});


hotelController.get('/:id/delete', async (req, res) => {
    const hotel = await getById(req.params.id);

    if (hotel.owner != req.user._id) {
        return res.redirect('/auth/login')
    }

    await deleteById(req.params.id);
    res.redirect('/')
});

hotelController.get('/:id/book', async (req, res) => {
    const hotel = await getById(req.params.id);

    try {
        if (hotel.owner == req.user._id) {
            hotel.isOwner = true;
            throw new Error('Cannot book your own hotel!')
        }
        if (hotel.bookings.map(b => b.toString()).includes(req.user._id.toString())) {
            hotel.isBooked = true;
            throw new Error('Cannot book twice!')
        }
        await bookRoom(req.params.id, req.user._id)
        res.redirect(`/hotel/${req.params.id}/details`)

    } catch (error) {
        res.render('details', {
            title: 'Hotel Details',
            hotel,
            errors: parseError(error)
        });
    }



});

module.exports = hotelController