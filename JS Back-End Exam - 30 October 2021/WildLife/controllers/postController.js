//TO CHANGE WITH REAL ASSINGMENT


//check if all fields are fulfilled
// if (Object.values(req.body).some(x => !x)) {
//     throw new Error('All fields are required!')
// }const { isGuest } = require('../middlewares/guard');
const { getAll, createPost, getById, editById, deleteById, updateUser, getByIdWithAllData, upVote, downVote } = require('../services/itemServices');
const { parseError } = require('../util/parser');
const postController = require('express').Router()


//guards


postController.get('/', async (req, res) => {
        try {
                const posts = await getAll();
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
        const post = await getByIdWithAllData(req.params.id)
        //isOwner is for edit and delete functionality
        const isOwner = post.author._id.toString() == (req.user?._id)?.toString();

        const author = [post.author.firstName + ' ' + post.author.lastName];
        const raiting = post.raiting
        const votesCount = post.votes.length == 0 ? 0 : raiting
        const alreadyVotedUser = post.votes.map(x => x._id.toString()).includes(req.user?._id.toString())
        const postHasVotes = post.votes.length > 0
        const votedList = []
        post.votes.map(x => votedList.push(x.email))
        res.render('details', {
                title: 'Details Page',
                user: req.user,
                post,
                author,
                alreadyVotedUser,
                isOwner,
                votesCount,
                postHasVotes,
                votedList
        })
});

postController.get('/edit/:id', async (req, res) => {
        //TODO guard for Owner
        const post = await getById(req.params.id)
        const isOwner = post.author.toString() == (req.user?._id)?.toString();
        if (!isOwner) {
                res.redirect('/auth/login')
        }

        res.render('edit', {
                title: 'Edit Page',
                user: req.user,
                post,
        })
})

postController.post('/edit/:id', async (req, res) => {
        //TODO guard for Owner
        const post = await getById(req.params.id)
        const isOwner = post.author.toString() == (req.user?._id)?.toString();
        if (!isOwner) {
                res.redirect('/auth/login')
        }

        try {
                if (Object.values(req.body).some(x => !x)) {
                        throw new Error('All fields are required!')
                }

                await editById(req.params.id, req.body)
                res.redirect(`/catalog/details/${req.params.id}`)
        } catch (error) {
                res.render('edit', {
                        errors: parseError(error),
                        post,
                        user: req.user
                })
        }
});


postController.get('/delete/:id', async (req, res) => {
        const post = await getById(req.params.id)
        const isOwner = post.author.toString() == (req.user?._id)?.toString();

        if (!isOwner) {
                return res.redirect(`/`)
        }
        await deleteById(req.params.id)
        res.redirect('/catalog')
});


postController.get('/upVote/:id', async (req, res) => {
        const post = await getById(req.params.id)
        if (post.author.toString() != (req.user?._id)?.toString()
                && post.votes.map(x => x.toString()).includes((req.user?._id)?.toString()) == false) {
                try {
                        await upVote(req.params.id, req.user._id);
                        res.redirect(`/catalog/details/${req.params.id}`)
                } catch (error) {
                        res.render('all-posts', {
                                errors: parseError(error),
                                user: req.user
                        })
                }

        }
});

postController.get('/downVote/:id', async (req, res) => {
        const post = await getById(req.params.id)
        if (post.author.toString() != (req.user?._id)?.toString()
                && post.votes.map(x => x.toString()).includes((req.user?._id)?.toString()) == false) {
                try {
                        await downVote(req.params.id, req.user._id);
                        res.redirect(`/catalog/details/${req.params.id}`)
                } catch (error) {
                        res.render('all-posts', {
                                errors: parseError(error),
                                user: req.user
                        })
                }

        }
});




module.exports = postController
