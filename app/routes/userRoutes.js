const { authJwt } = require("../middleware");
const controller = require("../controllers/userController");
const eventController = require("../controllers/eventController");
const db = require("../models");
const Score = db.score;
const Event = db.event;

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/home", authJwt.verifyToken, async (req, res) => {
    try{
      const userRole = req.user ? req.user.role : "guest";
      const events = await eventController.getEvent();
      res.render("home", {userRole,events, currentPath: req.path});
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  app.get("/unauthorized", (req, res) => {
    res.render("Unauthorized");
  });

  app.get("/notfound", (req, res) => {
    res.render("notFound");
  });

  app.get("/history-jury",authJwt.verifyToken, async (req, res) => {
    try{
      const userId = req.userId;
      const scores = await Score.findAll({
        where: {
          userId: userId
        }
      });
      const events = await Event.findAll();
      const userRole = req.user ? req.user.role : "guest";
      res.render("History", {userRole, scores, events});
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

};