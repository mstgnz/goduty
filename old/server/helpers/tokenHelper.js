const sendJwtClient = (user, res, data) => {
    
    const token = user.generateJwt();

    const { JWT_COOKIE, NODE_ENV } = process.env;

    return res.status(200).cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000 * 60),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        access_token: token,
        data: data
    });
}

const isTokenExists = (req) => {
    return req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
}

const getToken = (req) => {
    const authorization = req.headers.authorization;
    const access_token = authorization.split(":")[1];
    return access_token;
}

module.exports = {
    sendJwtClient,
    isTokenExists,
    getToken
};