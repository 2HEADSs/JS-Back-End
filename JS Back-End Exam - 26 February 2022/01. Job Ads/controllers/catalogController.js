//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { hasUser } = require('../middlewares/guard');
const { getAll, getById, editById, deleteById, applyForJob, searchRefDATA, addUserToItem, createAd, getOneWithCandidates } = require('../services/AdServices');
const { updateUser } = require('../services/userService');
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

catalogController.get('/create', hasUser(), (req, res) => {
        res.render('create', {
                title: 'Create Page',
                user: req.user
        })
})

catalogController.post('/create', hasUser(), async (req, res) => {
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
                const createdAd = await createAd(ad)
                await updateUser(req.user._id, createdAd._id)
                res.redirect('/catalog')
        } catch (error) {
                res.render('create', {
                        error: parseError(error),
                        ad,
                        user: req.user
                })
        }
});


catalogController.get('/details/:id', hasUser(), async (req, res) => {
        const ad = await getById(req.params.id)
        const candidates = []

        //isOwner is for edit and delete functionality
        ad.isOwner = ad.owner._id.toString() == (req.user?._id)?.toString();
        ad.hasApplied = ad.applied.map(x => x.toString()).includes(req.user?._id.toString())
        const countCandidates = ad.applied.length > 0 ? true : false;
        ad.countApplied = ad.applied.length

        if (countCandidates) {
                const adPopulateWithCandidates = await getOneWithCandidates(req.params.id)
                adPopulateWithCandidates.applied.map(x => candidates.push(x))
        };
        res.render('details', {
                title: 'Details Page',
                user: req.user,
                ad,
                candidates,
                countCandidates
        })
});

catalogController.get('/edit/:id', hasUser(), async (req, res) => {
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

catalogController.post('/edit/:id', hasUser(), async (req, res) => {
        //TODO guard for Owner
        const ad = await getById(req.params.id)
        const isOwner = ad.owner._id.toString() == (req.user?._id)?.toString();
        if (!isOwner) {
                res.redirect('/')
        }

        try {
                await editById(req.params.id, req.body)
                res.redirect(`/catalog/details/${req.params.id}`)
        } catch (error) {
                res.render('edit', {
                        error: parseError(error),
                        ad,
                        user: req.user
                })
        }
});


catalogController.get('/delete/:id', hasUser(), async (req, res) => {
        const ad = await getById(req.params.id)
        const isOwner = ad.owner._id.toString() == (req.user?._id)?.toString();

        if (!isOwner) {
                return res.redirect(`/auth/login/`)
        }
        await deleteById(req.params.id)
        res.redirect('/catalog')
});


catalogController.get('/apply/:id', hasUser(), async (req, res) => {
        const ad = await getById(req.params.id)
        if (ad.owner.toString() != (req.user?._id)?.toString()
                && ad.applied.map(x => x.toString()).includes((req.user?._id)?.toString()) == false) {
                try {
                        await applyForJob(req.params.id, req.user._id);
                        res.redirect(`/catalog/details/${req.params.id}`)
                } catch (error) {
                        res.render(`/catalog/details/${req.params.id}`, {
                                error: parseError(error),
                                ad,
                                user: req.user
                        })
                }

        } else {
                res.redirect('/')
        }
});





module.exports = catalogController
