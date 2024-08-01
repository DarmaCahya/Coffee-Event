const { authJwt } = require("../middleware");
const controller = require("../controllers/userController");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/home", authJwt.verifyToken, (req, res) => {
    try{
      const userRole = req.user ? req.user.role : null;
      res.render("home", {userRole});
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