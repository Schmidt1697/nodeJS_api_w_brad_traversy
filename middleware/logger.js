// Loggs request to console
//will not actually use this logger
// will use a 3rd party to do this - morgan

const logger = (req, res, next) => {
    req.hello = 'Hello world.'
    console.log('middleware ran')
    //need to call next so it knows when to move into next piece of middleware
    next()
    
}

module.exports = logger;