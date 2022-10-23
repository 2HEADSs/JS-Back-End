function hasUser() {
    return (req, res, next) => {
        if (req.user) {
            res.redirect('/')
        } else {
            next()
        }
    }
};

function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            //TODO redirect from assignment for correct redirect
            next()
        } else {
            res.redirect('/')
        }
    }
};

module.exports = {
    hasUser,
    isGuest
}