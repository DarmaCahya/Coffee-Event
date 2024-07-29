const db = require("../models");
const config = require("../config/authConfig");
const User = db.user;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8), 
        role: "jury"
        });

        if (user) {
        res.redirect("/admin/event");
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

exports.signin = async (req, res) => {
    try {
        const email = req.body.email || req.query.email;
        console.log("Attempting to find user by email:", email);
        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        if (!user) {
            console.log("No user found with email:", email);
            return res.status(404).send({ message: "User Not found." });
        }

        console.log("User found, checking password validity");
        const pass = req.body.password || req.query.password;
        const passwordIsValid = bcrypt.compareSync(pass, user.password);

        if (!passwordIsValid) {
            console.log("Invalid password for user:", email);
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!",
            });
        }

        console.log("Password is valid, signing token");
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.secret, {
            expiresIn: 86400,
        });

        req.session.token = token;
        console.log("Token saved in session:", req.session.token);
        return res.redirect('/home');
        
    } catch (error) {
        console.log("Error during sign-in:", error.message);
        res.status(500).send({ message: error.message });
    }
};

exports.signout = async (req, res) => {
    try {
        console.log("User during signout:", req.user);
        if (!req.user) {
            return res.status(400).send({
                message: "No user is currently signed in."
            });
        }

        const user = req.user;
        req.session = null; 

        return res.redirect("/home");
    } catch (err) {
        res.status(500).send({
            message: "An error occurred during sign out.",
            error: err.message
        });
    }
};
