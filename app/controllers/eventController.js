const db = require("../models");
const Event = db.event;
const Op = db.Sequelize.Op;

exports.createEvent = async (req, res) => {
    try{
        const {image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin} = req.body;
        if (!image || !title || !description || !tag || !startDate || !endDate || !pin) {
            return res.status(400).json({ message: "this field are required." }); 
        }

        const newEvent = await Event.create({
            image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin
        });
        res.status(201).json(newEvent);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
}

exports.getEvent = async (req, res) => {
    try{
        const event = await Event.findAll();
        res.status(200).json(event);
    } catch (error){
        res.status(500).json({ message: error.message });
    }
}

exports.getEventById = async (req, res) => {
    try{
        const id = req.params.id;
        const event = await Event.findByPk(id);

        if(!event){
            return res.status(404).json({ message: "Event not found." });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteEvent = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Event.destroy({
          where: { id: id }
        });
    
        if (num == 1) {
          res.send({ message: "Event was deleted successfully!" });
        } else {
          res.send({ message: `Cannot delete Event with id=${id}. Maybe Event was not found!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Could not delete Event with id=${id}` });
    }
}

exports.updateEvent = async (req, res) => {
    const id = req.params.id;
    const {image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin} = req.body;

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

    try {
        const [num] = await Event.update(updateFields, {
        where: { id: id }
        });

        if (num == 1) {
        res.send({ message: "Event was updated successfully." });
        } else {
        res.send({ message: `Cannot update Event with id=${id}. Maybe Event was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Error updating Event with id=${id}` });
    }
}

exports.searchEvent = async (req, res) => {
    const title = req.body.title;
    try {
        const event = await Event.findAll({where : {title: {[Op.like]: '%' + title + '%'}}});
    
        if (event.length === 0) {
          return res.status(404).json({ message: "Event not found." });
        } else {
          res.status(200).json(event);
        } 
      }catch (error) {
        res.status(500).send({message: 'Error retrieving Event with title=' + title});
    }
}