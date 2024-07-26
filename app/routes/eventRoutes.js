const { verifySignUp } = require("../middleware");
const controller = require("../controllers/eventController");
const authJwt = require('../middleware/authJWT');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/event/create", [authJwt.verifyToken, authJwt.isAdmin], controller.createEvent);
    app.post("/api/event/search", controller.searchEvent);
    app.get("/api/event", controller.getEvent);
    app.get("/api/event/:id", controller.getEventById);
    app.delete("/api/event/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteEvent);
    app.put("/api/event/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateEvent);

};