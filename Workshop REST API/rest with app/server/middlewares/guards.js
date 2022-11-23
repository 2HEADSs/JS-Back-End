function hasUser() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.status(401).json({ message: 'Please login in!' })
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (req.user) {
            res.status(400).json({ message: 'You are alreade logfed in!' })
        } else {
            next();
        }
    };
}

module.exports = {
    hasUser,
    isGuest
}