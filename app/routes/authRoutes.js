const { verifySignUp } = require("../middleware");
const controller = require("../controllers/authController");
const authJwt = require('../middleware/authJWT');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/auth/signup",
        [
            authJwt.verifyToken, verifySignUp.checkDuplicateUsernameOrEmail, authJwt.isAdmin
        ],
        controller.signup
    );

    app.post("/api/auth/signin", controller.signin);

    app.post("/api/auth/signout", authJwt.verifyToken, controller.signout);

    app.get("/admin/signup", [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
        const userRole = req.user ? req.user.role : "guest";
        res.render("Authentication/signup", { userRole, currentPath: req.path });
    });    
    
    app.get("/signin", (req, res) => {
        res.render("Authentication/login");
    });
};