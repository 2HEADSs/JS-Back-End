function hasUser() {
    return (req, res, next) => {
        if (req.user) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
};

function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            //TODO redirect from assignment for correct redirect
            res.redirect('/auth/login')
        } else {
            next()
        }
    }
};

module.exports = {
    hasUser,
    isGuest
}