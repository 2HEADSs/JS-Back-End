//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll, createPost, getById, editById, deleteById, buyCrypto, searchRefDATA, addUserToItem, updateUser } = require('../services/itemServices');
const { parseError } = require('../util/parser');
const postController = require('express').Router()


//guards


postController.get('/', async (req, res) => {
        //TODO with real posts
        let posts = []
        try {
                crypto = await getAll();
                res.render('all-posts', {
                        title: 'Catalog Page',
                        user: req.user,
                        posts
                })
        } catch (error) {
                res.render('home', {
                        error: parseError(error),
                        user: req.user
                })
        }
})

postController.get('/create', (req, res) => {
        res.render('create', {
                title: 'Create Page',
                user: req.user
        })
})

postController.post('/create', async (req, res) => {
        const post = {
                title: req.body.title,
                keyword: req.body.keyword,
                location: req.body.location,
                date: req.body.date,
                imageUrl: req.body.imageUrl,
                description: req.body.description,
                author: req.user._id,
        }


        try {
                if (Object.values(req.body).some(x => !x)) {
                        throw new Error('All fields are required!')
                }
                const createdPost = await createPost(post)
                await updateUser(req.user._id, createdPost._id)
                res.redirect('/catalog')
        } catch (error) {
                res.render('create', {
                        errors: parseError(error),

                        body: post,
                        user: req.user
                })
        }
});


postController.get('/details/:id', async (req, res) => {
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

postController.get('/edit/:id', async (req, res) => {
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

postController.post('/edit/:id', async (req, res) => {
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


postController.get('/delete/:id', async (req, res) => {
        const crypto = await getById(req.params.id)
        const isOwner = crypto.owner.toString() == (req.user?._id)?.toString();

        if (!isOwner) {
                return res.redirect(`/auth/login/`)
        }
        await deleteById(req.params.id)
        res.redirect('/crypto/catalog')
});


postController.get('/buy/:id', async (req, res) => {
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





module.exports = postController
