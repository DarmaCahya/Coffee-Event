const controller = require('../controllers/scoreController');
const authJwt = require('../middleware/authJWT');
const verifyPin = require('../middleware/verifyPin');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/score/create", [authJwt.verifyToken, authJwt.isAdminOrJury], controller.createScore);
    app.get("/api/scores", [authJwt.verifyToken, authJwt.isAdmin], controller.getScores);
    app.get("/api/score/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.getScoreById);
    app.put("/api/score/:id", [authJwt.verifyToken, authJwt.isAdminOrJury], controller.updateScore);
    app.delete("/api/score/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteScore);
    app.post("/api/scores/search", [authJwt.verifyToken, authJwt.isAdmin], controller.searchScores);
};
