const User = require('../models/user');
const bcrypt = require('bcrypt');
const connection = require('../configs/database');
const {isAuth, loggedIn} = require("../middleware/authMiddleware");
require('dotenv').config();
const mailer = require('../utils/mailer');

const create = (req, res) => {
    res.render('auth/register');
}

const please = (req, res) => {
    res.render('auth/please');
}


const register = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (email && password && name) {
            const user = await User.findByEmail(email);

            if (user) {
                // User with this email already exists
                const conflictError = 'User credentials already exist.';
                return res.render('auth/register', { email, password, name, conflictError });
            }

            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUND));
            const hashedEmail = await bcrypt.hash(email, parseInt(process.env.BCRYPT_SALT_ROUND));
            // Create a new user
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword
            });

            mailer.sendMail(email, "Verify Email", `<a href="${process.env.APP_URL}/verify?email=${email}&token=${hashedEmail}"> Verify </a>`);

            await User.create(newUser);

            // Redirect to login page after successful registration
            return res.redirect('/login');
        } else {
            const conflictError = 'User credentials are incomplete.';
            return res.render('auth/register', { email, password, name, conflictError });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const verify = async (req, res) => {
    let email = req.query.email;
    let token = req.query.token;

    try {
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await User.findByEmail(email);
        if (!user) {
            // Người dùng không tồn tại
            return res.redirect('/404');
        }

        // So sánh token từ URL với token trong cơ sở dữ liệu
        const isTokenValid = await bcrypt.compare(email, token);

        if (isTokenValid) {
            // Nếu token hợp lệ, đánh dấu email đã được xác minh
            await User.verify(email);
            if(req.session.loggedin) req.session.loggedin = false;
            return res.redirect('/login');
        } else {
            // Nếu token không hợp lệ, chuyển hướng đến trang lỗi 404
            return res.redirect('/404');
        }
    } catch (error) {
        console.error(error);
        return res.send('Error');
    }
};

module.exports = {
    create, register, please, verify
}