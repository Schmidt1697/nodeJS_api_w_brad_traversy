const advancedResults = (model, populate) => async (req, res, next) => {
     //initialize query
     let query;

     //make copy of req.query
     const reqQuery = {...req.query}
     
     // Fields to exclude
     const removeFields = ['select', 'sort', 'page', 'limit']
 
     // Loop over remove fields and delete from reqQuery
     removeFields.forEach(param => delete reqQuery[param])
 
     console.log(reqQuery)
 
     // Create query string to be able to manipulate
     let queryStr = JSON.stringify(reqQuery);
 
     // create operators like $gt and $gte... add some reg ex for what is acceptable and add $ to front of query string
     queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
 
     // Finding resource
     query = model.find(JSON.parse(queryStr)) //adding on the reverse populate virtual of courses
 
     // Select Fields - only do this if a select is included, want this for only displaying info requested vs sending everything 
             // {{URL}}/api/v1/bootcamps?select=name,description => this will return only the bootcamp name and description
     if(req.query.select){
         //use the .split() method to create a new array with whatever exists in select query, make it into an array, then join with spaces instead of ,
         const fields = req.query.select.split(',').join(' ');
         query = query.select(fields);
     }
 
     //Sort
     if(req.query.sort){
         const sortBy = req.query.sort.split(',').join(' ');
         query = query.sort(sortBy);
     } else {
         //if no sort selection, default sort is using the 'createdAt' data from the model
         query = query.sort('-createdAt')
     }
 
     // PAGINATION
         //pg 1 will always be the default unless specified - want to be able to get next and previous pages available to frontend 
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 10;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     const total = await model.countDocuments();  //mongoose method to count all documents
 
     query = query.skip(startIndex).limit(limit);

     //if there is aything to populate, no matter the model, will add it to the query
     if(populate){
        query = query.populate(populate)
     }
 
     //Executing Query
     const results = await query;
 
     // PAGINATION RESULT
     const pagination = {};
 
     //show next option
     if(endIndex < total){
         pagination.next = {
             page: page + 1,
             limit: limit
         }
     }
 
     //show previous option
     if(startIndex > 0){
         pagination.prev = {
             page: page - 1,
             limit: limit
         }
     }

     res.advancedResults = {
        success: true,
        count: results.length,
        pagination: pagination,
        data: results
     }

     next();
}

module.exports = advancedResults;