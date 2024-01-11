const User = require('../models/User');

const getUserFullName = async(id) => {
    const user = await User.findById(id);
    if(user){
        return user.firstname+' '+user.lastname;
    }
    return false;
}

module.exports = { getUserFullName };