const controller = require('../controllers/scoreController');
const authJwt = require('../middleware/authJWT');
const db = require("../models");
const Event = db.event;
const Op = db.Sequelize.Op;
const verifyPin = require('../middleware/verifyPin');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/score/:id/create", [authJwt.verifyToken, authJwt.isAdminOrJury], controller.createScore);
    app.get("/api/scores", [authJwt.verifyToken, authJwt.isAdmin], controller.getScores);
    app.get("/api/event/:eventId/score/:scoreId", [authJwt.verifyToken, authJwt.isAdminOrJury], controller.getScoreById);
    app.post("/admin/event/:id/score/:idScore/update", [authJwt.verifyToken, authJwt.isAdminOrJury], controller.updateScore);
    app.delete("/api/event/:eventId/scores/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteScore);
    app.post("/api/scores/search", [authJwt.verifyToken, authJwt.isAdmin], controller.searchScores);


    //handle pin verify
    app.post('/event/score/:id/verify', [authJwt.verifyToken, authJwt.isAdminOrJury], async (req, res) => {
        try {
            const id = req.params.id;
            const { pin } = req.body;
    
            // Check if the event exists
            const event = await Event.findByPk(id);
            if (!event) {
                return res.status(404).send({ message: 'Event not found' });
            }
    
            // Verify the PIN
            if (event.pin !== pin) {
                return res.status(401).send({ message: 'Invalid PIN' });
            }
    
            res.redirect(`/event/score/${id}/form`);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });
    app.get("/event/score/:id/form", [authJwt.verifyToken, authJwt.isAdminOrJury], async (req, res) => {
        try {
            const userId = req.user.id;
            const user = req.user;
            const userRole = req.user ? req.user.role : null;
            const id = req.params.id;
            const event = await Event.findByPk(id);
            if (!event) {
                return res.status(404).send({ message: 'Event not found' });
            }
    
            res.render('Scores/form', {id, user, userRole, userId});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

    app.get("/event/:id/score/:idScore", [authJwt.verifyToken, authJwt.isAdminOrJury], async (req, res) => {
        try {
            const id = req.params.id;
            const idScore = req.params.idScore;
            const event = await Event.findByPk(id);
            if (!event) {
                return res.status(404).send({ message: 'Event not found' });
            }

            const score = await controller.getScoreById(req, res);
            res.render("Scores/updateForm", { event, score, id });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });    
};
