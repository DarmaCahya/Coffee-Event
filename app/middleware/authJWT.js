const jwt = require("jsonwebtoken");
const config = require("../config/authConfig.js");
const db = require("../models/index.js");
const User = db.user;
const Event = db.event;

verifyToken = (req, res, next) => {
    let token = req.session.token;
    
    console.log("Token from session:", token); 
    
    req.user = {};

    if (!token) {
        req.user.role = "guest";
        next();
        return;
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log("Token verification error:", err); 
            req.user.role = "guest";
            return res.status(401).redirect('/signin')
        }
        console.log("Decoded token ID:", decoded.id); 
        req.userId = decoded.id;
        req.user = decoded;
        console.log("req.user:", req.user);
        console.log("req.userId:", req.userId);
        next();
    });
};

isAdmin = (req, res, next) => {
    const id = req.user.id
    User.findByPk(id)
    .then(user => {
        if (!user) {
          return res.status(401).redirect('/unauthorized')
        }

        if (user.role === "admin") {
            req.isAdmin = true;
            next();
            return;
        }
        return res.status(401).redirect('/unauthorized')
    })
    .catch(err => {
        res.status(500).send({
            message: "Unable to validate User role!"
        });
    });
};

isAdminEvent = (req, res, next) => {
  const userId = req.user.id; 
  const eventId = req.params.eventId; 

  Event.findByPk(eventId)
  .then(event => {
      if (!event) {
          return res.status(404).send({ message: "Event not found!" });
      }

      if (event.userId === userId) {
          req.isAdminEvent = true;
          next();
          return;
      }

      return res.status(403).redirect('/unauthorized'); 
  })
  .catch(err => {
      res.status(500).send({
          message: "Unable to validate Event admin role!"
      });
  });
};


isJury = (req, res, next) => {
  User.findByPk(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      if (user.role === "jury" || req.isAdmin) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Jury Role!"
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Unable to validate User role!"
      });
    });
};

isAdminOrJury = (req, res, next) => {
    User.findByPk(req.user.id)
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User not found." });
        }
        if (user.role === "admin" || user.role === "jury") {
          next();
          return;
        }
  
        return res.status(401).redirect('/unauthorized')
      })
      .catch(err => {
        res.status(500).send({
          message: "Unable to validate User role!"
        });
      });
  };

  const isAdminOrAdminEvent = async (req, res, next) => {
    const userId = req.userId; 
    const eventId = req.params.id; 
  
    try {
      const user = await User.findByPk(userId);
      
      if (!user) {
          return res.status(404).send({ message: "User not found." });
      }

      if (user.role === "admin") {
          req.isAdmin = true;
          next();
          return;
      }

      
      const event = await Event.findByPk(eventId);
      if (!event) {
          return res.status(404).send({ message: "Event not found!" });
      }

      if (event.userId === userId) {
          req.isAdminEvent = true;
          next();
          return;
      }
      return res.status(401).redirect('/unauthorized')

    } catch (err) {
        res.status(500).send({
            message: "Unable to validate Event admin role!"
        });
    }
  };  
  
  deactiveAccount = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      // Prevent deactivating admin accounts
      if (user.role === "admin") {
        return res.status(403).send({ message: "Cannot deactivate admin account" });
      }
  
      // Check if the account is already deactivated
      if (user.is_active === 0) {
        return res.status(400).send({ message: "This account has already been deactivated." });
      }
  
      // Deactivate account
      await User.update({ is_active: 0 }, { where: { id: userId } });
      return res.status(200).send({ message: "Successfully deactivated account" });
      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isAdminEvent: isAdminEvent,
    isJury: isJury,
    isAdminOrJury: isAdminOrJury,
    isAdminOrAdminEvent: isAdminOrAdminEvent,
    deactiveAccount: deactiveAccount
};

module.exports = authJwt;
