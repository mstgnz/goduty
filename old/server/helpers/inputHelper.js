const bcrypt = require('bcryptjs');

const loginForm = (req) => {
    return req.body.email && req.body.password;
}

const comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
}

module.exports = {
    loginForm,
    comparePassword
}