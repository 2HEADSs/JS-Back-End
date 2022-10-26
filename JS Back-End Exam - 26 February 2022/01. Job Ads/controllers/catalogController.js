//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll,getById, editById, deleteById, buyCrypto, searchRefDATA, addUserToItem, createAd } = require('../services/AdServices');
const { parseError } = require('../util/parser');
const catalogController = require('express').Router()


//guards


catalogController.get('/', async (req, res) => {
        //take real cryptos from servicec and send
        let ads = []
        try {
                ads = await getAll();
                res.render('catalog', {
                        title: 'All-Ads Page',
                        user: req.user,
                        ads
                })
        } catch (error) {
                res.render('home', {
                        error: parseError(error),
                        user: req.user
                })
        }
})

catalogController.get('/create', (req, res) => {
        res.render('create', {
                title: 'Create Page',
                user: req.user
        })
})

catalogController.post('/create', async (req, res) => {
        const ad = {
                headline: req.body.headline,
                location: req.body.location,
                companyName: req.body.companyName,
                companyDescription: req.body.companyDescription,
                owner: req.user._id,
        }
        try {
                if (Object.values(req.body).some(x => !x)) {
                        throw new Error('All fields are required!')
                }
                await createAd(ad)
                res.redirect('/catalog')
        } catch (error) {
                res.render('create', {
                        error: parseError(error),
                        ad,
                        user: req.user
                })
        }
});


catalogController.get('/details/:id', async (req, res) => {
        const ad = await getById(req.params.id)
        //isOwner is for edit and delete functionality
        ad.isOwner = ad.owner._id.toString() == (req.user?._id)?.toString();
        ad.applied = ad.applied.map(x => x.toString()).includes(req.user?._id.toString())
        res.render('details', {
                title: 'Details Page',
                user: req.user,
                ad
        })
});

catalogController.get('/edit/:id', async (req, res) => {
        //TODO guard for Owner
        const ad = await getById(req.params.id)
        const isOwner = ad.owner._id.toString() == (req.user?._id)?.toString();
        if (!isOwner) {
                res.redirect('/')
        }

        res.render('edit', {
                title: 'Edit Page',
                user: req.user,
                ad,
        })
})

catalogController.post('/edit/:id', async (req, res) => {
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


catalogController.get('/delete/:id', async (req, res) => {
        const crypto = await getById(req.params.id)
        const isOwner = crypto.owner.toString() == (req.user?._id)?.toString();

        if (!isOwner) {
                return res.redirect(`/auth/login/`)
        }
        await deleteById(req.params.id)
        res.redirect('/crypto/catalog')
});


catalogController.get('/buy/:id', async (req, res) => {
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





module.exports = catalogController
