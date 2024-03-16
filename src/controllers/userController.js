const connection = require('../configs/database');
const {getAllUsers} = require("../services/CRUDService");
const User = require('../models/user');

const handleGetAllUsers = async (req, res) => {
    let email = req.query.email;
    let users = '';
    if(!email) {
        users = await getAllUsers();
    }
    else {
        users = await User.findByEmail(email);
    }

    if(!users) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters',
        })
    }

    return res.status(200).json({
        errCode: 0,
        errMessage: 'ok',
        users
    })
}

module.exports = {
    handleGetAllUsers
}