
//if path is available only for register user

function hasUser() {
    return (req, res, next) => {
        if (req.user) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
};


//if path is available only for guestc
function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            //TODO redirect from assignment for correct redirect
            res.redirect('/')
        } else {
            next()
        }
    }
};

module.exports = {
    hasUser,
    isGuest
}