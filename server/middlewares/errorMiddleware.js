const CustomError = require('../classes/CustomError');

const errorMiddleware = (err, req, res, next) => {

    let customError;

    switch (err.name) {
        case "SyntaxError":
            customError = new CustomError("Unexpected Syntax", 400);
        break;
        case "ValidationError":
            customError = new CustomError(err.message, 400);
        break;
        case "CastError":
            customError = new CustomError("Please provide a valid id", 400);
        break;
        default:
            customError = err;
            customError.status = err.status || 500;
        break;
    }

    if(err.code === 11000){
        customError = new CustomError("Duplicate key error: Please check your form", 400);
        console.log(err)
    }

    res.status(customError.status).json({
        success: false,
        message: customError.message,
        inValid: customError.inValid
    });

}

module.exports = errorMiddleware;