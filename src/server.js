import express from "express";
import configViewEngine from "./configs/viewEngine";
require('dotenv').config();
const webRoutes = require("./routes/web");
const connection = require("./configs/database");
const session = require('express-session');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME;

//config req.body
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))
app.use(cors({ credentials: true, origin: true }));

configViewEngine(app);

app.use('/', webRoutes);

app.listen(port, hostname, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

