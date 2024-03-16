const connection = require("../configs/database");


const getAllUsers = async () => {
    let [results, fields] = await connection.query('select * from Users');
    return results;
}

const getAllPosts = async () => {
    let [results, fields] = await connection.query('select * from Posts');
    return results;
}

module.exports = {
    getAllUsers, getAllPosts
}