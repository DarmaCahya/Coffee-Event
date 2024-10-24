const { authJwt } = require("../middleware");
const controller = require("../controllers/coffeeController");
const db = require("../models");
const kopi = db.coffee;

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
    app.post("/api/coffee/create", authJwt.verifyToken, authJwt.isAdmin, controller.createCoffee);

    app.get("/list-kopi", authJwt.verifyToken, async (req, res) => {
        try{
          const userRole = req.user ? req.user.role : "guest";
          const coffees = await controller.getCoffee();
          res.render("Coffee/coffee-list", {userRole, coffees, currentPath: req.path});
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
    });

    app.get("/list-kopi/:id", authJwt.verifyToken, async (req, res) => {
        try{
          const userRole = req.user ? req.user.role : "guest";
          const coffeeId = req.params.id;
          const coffee = await controller.getCoffeeById(coffeeId);
          res.render("Coffee/coffee-list", {userRole, coffee, currentPath: req.path});
        } catch (error) {
          res.status(500).send({ message: error.message });
        }
    });

  };