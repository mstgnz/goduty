const CustomError = require('../classes/CustomError');
const jwt = require('jsonwebtoken');
const { isTokenExists, getToken } = require('../helpers/tokenHelper');

const accessRouteMiddleware = (req, res, next) => {

    const { JWT_SECRET_KEY } = process.env;

    if(!isTokenExists(req)){
        return next(new CustomError("You are not authorized to this route", 401));
    }
    const access_token = getToken(req);

    jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded)=>{
        if(err){
            return next(new CustomError("You are not authorized to access this route", 401));
        }
        req.user = decoded;
        next();
    });
}

module.exports = accessRouteMiddleware;