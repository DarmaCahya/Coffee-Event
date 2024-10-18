const { authJwt } = require("../middleware");
const controller = require("../controllers/userController");
const eventController = require("../controllers/eventController");

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
      const userRole = req.user ? req.user.role : null;
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

};