
const connection = require('../configs/database');
const {getAllUsers, getAllPosts} = require("../services/CRUDService");

const getHomepage = async (req, res) => {
    let resultsUsers = await getAllUsers();
    let resultsPosts = await getAllPosts()
    return res.render('home.ejs', {listUsers: resultsUsers, listPosts: resultsPosts})
}

const getAboutpage = (req, res) => {
    // res.send('hehe')
    res.render('index.ejs')
}

const getCreatepage = (req, res) => {
    res.render('create.ejs')
}

const getUpdatepage = async (req, res) => {
    const userId = req.params.id;
    let [results, fields] = await connection.query('select * from Users where id = ?', [userId]);
    let user = results && results.length > 0 ? results[0] : {};
    res.render('edit.ejs', {userEdit : user, edit:false})
}

const getDeleteUser = async (req, res) => {
    const userId = req.params.id;
    await connection.query('DELETE FROM Users WHERE id=?', [userId]);
    let [results, fields] = await connection.query('SELECT * FROM Users');
    return res.render('home.ejs', {listUsers: results})
} 

const postCreateUser = async (req, res) => {
    // console.log(">>> req.body: ", req.body);
    let email = req.body.email;
    let name = req.body.myname;
    let city = req.body.city;

    await connection.query(
        `INSERT INTO Users (email, name, city) VALUES (?, ?, ?)`,
        [email, name, city]
    );
    // const [results, fields] = await connection.query('select * from Users u');
    // console.log(">>> check: ", results);
    res.send('Created new user !')
}

const postUpdateUser = async (req, res) => {
    // console.log(">>> req.body: ", req.body);
    let id = req.params.id;
    let email = req.body.email;
    let name = req.body.myname;
    let city = req.body.city;

    let [results, fields] = await connection.query(
        `UPDATE Users SET email=?, name=?, city=?
        WHERE id=?`,
        [email, name, city, id]
    );
    // const [results, fields] = await connection.query('select * from Users u');
    // console.log(">>> check: ", results);
    let user = {id, name, city, email};
    res.render('edit.ejs', {userEdit: user, edit:true, text:'Updated successfully!'})
}

const createpost = async (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let userEmail = req.session.user.email;

    await connection.query(
        `INSERT INTO Posts (userEmail, title, content) VALUES (?, ?, ?)`,
        [userEmail, title, content]
    );
    
    res.redirect('/');
}

module.exports = {
    getHomepage, getAboutpage, getCreatepage, getUpdatepage, getDeleteUser,
    postCreateUser, postUpdateUser, createpost
}