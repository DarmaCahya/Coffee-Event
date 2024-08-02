const db = require("../models");
const Event = db.event;
const Score = db.score;
const Op = db.Sequelize.Op;

exports.createEvent = async (req, res) => {
    try {
        const { image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin } = req.body;
        
        if (!image || !title || !description || !tag || !startDate || !endDate || !pin) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const validTags = ['completed', 'on-going', 'upcoming'];
        if (!validTags.includes(tag)) {
            return res.status(400).json({ message: "Invalid tag value." });
        }

        const existingEvent = await Event.findOne({ where: { title: title } });
        if (existingEvent) {
            return res.status(400).json({ message: "Event with this title already exists." });
        }

        if(pin.length !== 4){
            return res.status(400).json({ message: "PIN must be exactly 4 digits long." });
        }

        const newEvent = await Event.create({
            image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin
        });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getEvent = async () => {
    try {
        const events = await Event.findAll();
        return events;
    } catch (error) {
        throw new Error(error.message); 
    }
};

exports.getEventById = async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            throw new Error("Event not found.");
        }

        return event;
    } catch (error) {
        throw error;
    }
};


exports.deleteEvent = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Event.destroy({
            where: { id: id }
        });

        if (num == 1) {
            return res.redirect("/admin/dashboard");
        } else {
            return res.json({ success: false, message: `Cannot delete Event with id=${id}. Maybe Event was not found!` });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: `Could not delete Event with id=${id}` });
    }
};

exports.updateEvent = async (req, res) => {
    const id = req.params.id;
    const event = await Event.findByPk(id);
    const { image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin } = req.body;

    let updateFields = {};
    if (image) updateFields.image = image;
    if (title) updateFields.title = title;
    if (description) updateFields.description = description;
    if (tag) updateFields.tag = tag;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;
    if (winner1) updateFields.winner1 = winner1;
    if (winner2) updateFields.winner2 = winner2;
    if (winner3) updateFields.winner3 = winner3;
    if (pin) updateFields.pin = pin;

    const validTags = ['completed', 'on-going', 'upcoming'];
    if (tag && !validTags.includes(tag)) {
        return res.status(400).json({ message: "Invalid tag value." });
    }

    if (title && title !== event.title) {
        const existingEvent = await Event.findOne({ where: { title: title } });
        if (existingEvent) {
            return res.status(400).json({ message: "Event with this title already exists." });
        }
    }

    if(pin && pin.length !== 4){
        return res.status(400).json({ message: "PIN must be exactly 4 digits long." });
    }

    try {
        const [num] = await Event.update(updateFields, {
            where: { id: id }
        });

        if (num == 1) {
            res.redirect(`/admin/dashboard`);
        } else {
            res.send({ message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Error updating Event with id=${id}` });
    }
};


exports.searchEvent = async (req, res) => {
    const title = req.query.title || req.body.title; 
    try {
        const events = await Event.findAll({
            where: {
                title: {
                    [Op.like]: '%' + title + '%'
                }
            }
        });

        if (req.route.path === '/event/search') {
            return events;
        }

        if (events.length === 0) {
            return res.status(404).json({ message: "Event not found." });
        } else {
            res.status(200).json(events);
        }
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving Event with title=' + title });
    }
}