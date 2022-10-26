//TO CHANGE WITH REAL ASSINGMENT

const { hasUser } = require('../middlewares/guard');
const { createItem, getAll, getById, editById, deleteById, getOwner, bitById } = require('../services/itemServices');
const { parseError } = require('../util/parser');


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }

const catalogController = require('express').Router()

//TODO replace with real controller by assignment
catalogController.get('/browse', async (req, res) => {
    let items = [];

    items = await getAll()
    res.render('browse', {
        //title is not nessaccery I made the templete with {{title}}
        title: 'Auction House',
        user: req.user,
        items
    })


});

catalogController.get('/create', hasUser(), (req, res) => {
    res.render('create', {
        //title is not nessaccery I made the templete with {{title}}
        title: 'Auction House',
        user: req.user
    })
});

catalogController.post('/create', hasUser(), async (req, res) => {
    const item = {
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        price: req.body.price,
        owner: req.user._id,
    }

    try {
        if (Object.values(req.body).some(x => !x)) {
            throw new Error('All fields are required!')
        }

        await createItem(item)
        res.redirect('/item/browse')
    } catch (error) {
        res.render('create', {
            errors: parseError(error),
            //BODY
            item,
            user: req.user
        })
    }

});

catalogController.get('/details/:id', async (req, res) => {

    const item = await getById(req.params.id)
    const isOwner = item.owner.toString() == (req.user?._id)?.toString();
    const owner = await getOwner(item.owner);
    item.bidder = item.bidders[item.bidders.length - 1] == req.user._id

    if (isOwner) {
        res.render('details-owner', {
            title: 'Auction Details',
            user: req.user,
            item,
        })

    } else {
        res.render('details', {
            title: 'Auction Details',
            user: req.user,
            item,
            owner,
        })
    }
    // item.bidder = item.bidder.map(x => x.toString()).includes(req.user?._id.toString())

})

catalogController.post('/details/:id', async (req, res) => {

    const item = await getById(req.params.id)
    // const isOwner = item.owner.toString() == (req.user?._id)?.toString();
    const owner = await getOwner(item.owner);

    // map(x => x.toString()).includes(req.user?._id.toString())
    res.redirect(`/item/details/${req.params.id}`)
    try {
        await bitById(req.params.id, req.body.bid, req.user._id)
        res.redirect(`/item/details/${req.params.id}`)
    } catch (error) {
        res.render('edit', {
            error: parseError(error),
            item,
            user: req.user
        })
    }



})

catalogController.get('/edit/:id', async (req, res) => {
    const item = await getById(req.params.id);
    const isOwner = item.owner.toString() == (req.user?._id)?.toString();
    if (!isOwner) {
        res.redirect('/auth/login')
    }

    res.render('edit', {
        title: 'Edit Auction',
        user: req.user,
        item
    })

})

catalogController.post('/edit/:id', async (req, res) => {
    const item = await getById(req.params.id);
    const isOwner = item.owner.toString() == (req.user?._id)?.toString();
    if (!isOwner) {
        res.redirect('/')
    }

    try {
        await editById(req.params.id, req.body)
        res.redirect(`/item/details/${req.params.id}`)
    } catch (error) {
        res.render('edit', {
            error: parseError(error),
            item,
            user: req.user
        })
    }
});


catalogController.get('/delete/:id', async (req, res) => {
    const item = await getById(req.params.id);
    const isOwner = item.owner.toString() == (req.user?._id)?.toString();
    if (!isOwner) {
        res.redirect('/')
    }

    await deleteById(req.params.id)
    res.redirect('/item/browse')

})

module.exports = catalogController