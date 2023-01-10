class ErrorResponse extends Error {
    constructor(message, statusCode){
        //available method inside the constructor
        super(message);
        //custom method 
        this.statusCode = statusCode
    }
}

module.exports = ErrorResponse;