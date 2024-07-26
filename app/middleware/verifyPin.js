const db = require("../models");
const Event = db.event;

const verifyPin = async (req, res, next) => {
    const {eventId, pin} = req.body;
    try {
        const event = await Event.findByPk(eventId);

        if(!event) {
            return res.status(404).send({ message: "Event not found." });
        }

        if (event.pin !== pin) {
            return res.status(403).send({ message: "Invalid PIN." });
        }
        next();
    } catch (error){
        res.status(500).send({ message: "Error verifying PIN." });
    }
};

module.exports = verifyPin;