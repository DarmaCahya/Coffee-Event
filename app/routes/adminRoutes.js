const { authJwt } = require("../middleware");
const eventController = require("../controllers/eventController");
const scoreController = require("../controllers/scoreController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/admin/dashboard", [authJwt.verifyToken, authJwt.isAdmin], async (req,res) => {
    try{
        const events = await eventController.getEvent();
        const userRole = req.user ? req.user.role : "guest";
        res.render('Event/event', { events, userRole, currentPath: req.path });
    }catch (error) {
        res.status(500).send({ message: error.message });
    }
  })

  app.get("/admin/event/:id/scores", [authJwt.verifyToken, authJwt.isAdmin], async (req,res) => {
    try{
        const eventId = req.params.id;
        const score = await scoreController.getScores(eventId);
        res.render("Admin/dashboard", {score});
    }catch (error) {
        res.status(500).send({ message: error.message });
    }
  })

};