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
            role: req.body.role,
            is_active: 1
        });

        if (user) {
            res.redirect("/admin/dashboard");
        }
    } catch (error) {
        res.status(500).send({message: "Terjadi kesalahan saat sign-up.",
    });
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
            return res.redirect('/signin?error=User tidak ditemukan');
        }

        if (user.is_active === 0) {
            return res.status(403).send({ message: "Akun Anda telah dinonaktifkan." });
        }

        console.log("User found, checking password validity");
        const pass = req.body.password || req.query.password;
        const passwordIsValid = bcrypt.compareSync(pass, user.password);

        if (!passwordIsValid) {
            console.log("Invalid password for user:", email);
            return res.redirect('/signin?error=InvalidPassword');
        }

        console.log("Password is valid, signing token");
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role}, config.secret, {
            expiresIn: 86400,
        });
        req.session.token = token;
        console.log(token);
        console.log("Token saved in session:", req.session.token);
        return res.redirect('/home');
        
    } catch (error) {
        res.status(500).send({ message: "Error saat sign-in:"});
    }
};

exports.signout = async (req, res) => {
    try {
        console.log("User during signout:", req.user);
        if (!req.user) {
            return res.status(400).send({
                message: "Tidak ada pengguna yang sedang sign-in."
            });
        }

        const user = req.user;
        req.session = null; 

        return res.redirect("/home");
    } catch (err) {
        res.status(500).send({
            message: "Terjadi kesalahan saat sign-out.",
        });
    }
};
