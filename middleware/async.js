//create this handler so we don't have to repeat ourselves for each CRUD operation in the bootcamp controller w/ a repeated try,catch 
const asyncHandler = fn => (req, res, next) => 
    Promise
        .resolve(fn(req, res, next))
        .catch(next)

module.exports = asyncHandler