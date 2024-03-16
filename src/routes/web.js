const express = require('express');
const router = express.Router();
const {getHomepage, getAboutpage, getCreatepage, getUpdatepage, getDeleteUser,
     postCreateUser, postUpdateUser, createpost
    } = require("../controllers/homeController");

const {isAuth, loggedin, verified} = require("../middleware/authMiddleware");
const {showLoginForm, login, logout} = require("../controllers/log");
const {create, register, please, verify} = require("../controllers/regis");
const {handleGetAllUsers} = require("../controllers/userController");


router.get('/', loggedin, verified, getHomepage);
router.get('/about', getAboutpage);
router.get('/create', getCreatepage);
router.get('/update/:id', getUpdatepage);
router.get('/delete/:id', getDeleteUser);

router.post('/create-user', postCreateUser);
router.post('/update/:id', postUpdateUser);

router.get('/login', isAuth, showLoginForm);
router.post('/login', login);
router.get('/register', isAuth, create);
router.post('/register', register);
router.get('/logout', loggedin, logout);
router.get('/verify', verify);
router.get('/please-verify', please);

router.post('/create-post', createpost);

router.get('/api/get-all-users', handleGetAllUsers);

module.exports = router;