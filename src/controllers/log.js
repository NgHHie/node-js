const User = require('../models/user');
const bcrypt = require('bcrypt');
const connection = require('../configs/database');
const {isAuth, loggedin} = require("../middleware/authMiddleware");
require('dotenv').config();

const showLoginForm = (req, res) => {
    return res.render('auth/login.ejs')
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        try {
            const user = await User.findByEmail(email);
            if (!user) {
                // const conflictError = 'User credentials are not valid.';
                // res.render('auth/login', { email, password, conflictError });;
                res.status(200).json({
                    errCode: 1,
                    message: 'Wrong username or password',
                    user: {}
                })
            } else {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result == true) {
                        req.session.loggedin = true;
                        req.session.user = user;
                        // res.redirect('/');
                        res.status(200).json({
                            errCode: 0,
                            message: 'Login success',
                            user: user.email 
                        })
                    } else {
                        // const conflictError = 'User credentials are not valid.';
                        // res.render('auth/login', { email, password, conflictError });
                        res.status(200).json({
                            errCode: 1,
                            message: 'Wrong username or password',
                            user: {}
                        })
                    }
                })
            }
        } catch (error) {
            console.log(error);
            // res.status(500).send('Internal Server Error');
            res.status(500).json({
                errCode: 2,
                message: 'Missing inputs parameter!',
                user: {}
            })
        }
    } else {
        console.log('1');
        // const conflictError = 'User credentials are not valid.';
        // res.render('auth/login', { email, password, conflictError });
        res.status(200).json({
            errCode: 2,
            message: 'Missing inputs parameter!',
            user: {}
        })
    }
}

const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) res.send('Error');
        res.redirect('/');
    })
}



module.exports = {
    showLoginForm, login, logout
}