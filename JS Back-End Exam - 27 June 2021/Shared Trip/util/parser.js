//parser for error handlering

function parseError(error) {
    //comes from mongoose if get in IF clause - error came from mongoose. else error is generate by me
    if (error.name == 'ValidationError') {
        //will return array from string with all error from mongoose
        return Object.values(error.errors).map(v => v.message)
    } else {
        return error.message.split('\n')
    }
}

module.exports = {
    parseError
}