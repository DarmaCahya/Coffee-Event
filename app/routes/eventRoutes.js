const controller = require("../controllers/eventController");
const scoreController = require("../controllers/scoreController");
const authJwt = require('../middleware/authJWT');
const db = require("../models");
const Score = db.score;
const User = db.user

const setUserInLocals = (req, res, next) => {
    res.locals.user = req.user;
    res.locals.isAdmin = req.isAdmin;
    next();
};

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
    app.delete("/api/event/delete/:id", [authJwt.verifyToken, authJwt.isAdminOrAdminEvent], controller.deleteEvent);
    app.put('/api/event/update/:id', [authJwt.verifyToken, authJwt.isAdminOrAdminEvent], controller.updateEvent);

    app.get("/event", authJwt.verifyToken, async (req, res) => {
        try {
            const userId = req.userId
            const userRole = req.user ? req.user.role : "guest";
            const events = await controller.getEvent();
            res.render('Event/event', { userId, events, userRole, currentPath: req.path});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });    

    app.get("/event/:id", authJwt.verifyToken, async (req, res) => {
        try {
            const userRole = req.user ? req.user.role : "guest";
            const user = req.user;
            const id = req.params.id;
            
            const event = await controller.getEventById(id);
            
            const scores = await Score.findAll({
                where: {
                    eventId: id
                }, 
                include: [{
                    model: User,
                    attributes: ['username']                
                }]
            });
            console.log(scores);

            let score = null;
    
            if (userRole !== "guest") {
                score = await Score.findOne({
                    where: {
                        eventId: id,
                        userId: user.id
                    }
                });
            }
    
            res.render('Event/eventDetail', { scores, user, event, id, userRole, score, currentPath: req.path });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });        
    
    app.post("/event/search", authJwt.verifyToken, async (req, res) => {
        try {
            const userRole = req.user ? req.user.role : "guest";
            const events = await controller.searchEvent(req, res);
            res.render('Event/event', { events, userRole, currentPath: req.path});
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

    // admin page
    // app.get("/admin/event", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) =>{
    //     try {
    //         const userRole = req.user.role; 
    //         const events = await controller.getEvent();
    //         res.render('Event/event', { events, userRole });
    //     } catch (error) {
    //         res.status(500).send({ message: error.message });
    //     }
    // });
};