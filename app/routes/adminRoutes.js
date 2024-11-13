const { authJwt } = require("../middleware");
const eventController = require("../controllers/eventController");
const scoreController = require("../controllers/scoreController");
const coffeeController = require("../controllers/coffeeController");
const db = require("../models");
const User = db.user;

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
        res.status(500).render("error", { message: error.message });
    }
  })

    app.get("/admin/event/create", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) =>{
        try {
          const adminEvents = await User.findAll({ where: { role: 'admin event' } });
          res.render('Admin/createEvent', {adminEvents});
        } catch (error) {
          res.status(500).render("error", { message: error.message });
        }
    });

    app.get("/admin/coffee/create", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) =>{
      try {
        res.render('Coffee/createCoffee');
      } catch (error) {
        res.status(500).send({ message: "Terjadi kesalahan saat akan mengakses url ini"});
      }
    });

    app.get("/admin/coffee/update/:id", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) =>{
      try {
        const userRole = req.user ? req.user.role : "guest";
        const coffeeId = req.params.id;  
        const coffee = await coffeeController.getCoffeeById(coffeeId);
        res.render('Coffee/updateCoffee', {coffeeId, userRole, coffee});
      } catch (error) {
          res.status(500).send({ message: "Terjadi kesalahan saat akan mengakses url ini"});
      }
    });

    app.get("/admin/event/:id", [authJwt.verifyToken, authJwt.isAdminOrAdminEvent], async (req, res) => {
        try {
          const userRole = req.user ? req.user.role : "guest";
          const adminEvents = await User.findAll({ where: { role: 'admin event' } });
          const eventId = req.params.id;  
          const event = await eventController.getEventById(eventId); 
      
          if (!event) {
            return res.status(404).send({ message: "Event tidak ditemukan." });
          }
      
          res.render("Admin/updateEvent", { event, eventId, adminEvents, userRole});
        } catch (error) {
          res.status(500).send({ message: "Terjadi kesalahan saat akan mengakses url ini"});
        }
      });

  app.get("/admin/users", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) =>{
    try{
      const users = await User.findAll();
      const usersJury = users.filter(user => user.role === "jury");
      const usersAdminEvent = users.filter(user => user.role === "admin event");

      const userRole = req.user ? req.user.role : "guest";
      res.render('Admin/manageUser', {userRole, usersJury, usersAdminEvent, currentPath: req.path});
    } catch (error) {
      res.status(500).send({ message: "Terjadi kesalahan saat akan mengakses url ini"});
    }
  }); 
  
  app.put("/admin/deactivate/:id", [authJwt.verifyToken, authJwt.isAdmin, authJwt.deactiveAccount]);

};