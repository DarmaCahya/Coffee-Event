const db = require("../models");
const Event = db.event;
const Score = db.score;
const Op = db.Sequelize.Op;

exports.createEvent = async (req, res) => {
    try {
        const { image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin, adminEvent  } = req.body;
        
        if (!image || !title || !description || !tag || !startDate || !endDate || !pin || !adminEvent ) {
            return res.status(400).json({ message: "Semua field harus terisi!" });
        }

        const validTags = ['completed', 'on-going', 'upcoming'];
        if (!validTags.includes(tag)) {
            return res.status(400).json({ message: "Nilai Tag tidak valid." });
        }

        const existingEvent = await Event.findOne({ where: { title: title } });
        if (existingEvent) {
            return res.status(400).json({ message: "Nama Event ini sudah digunakan." });
        }

        if(pin.length !== 4){
            return res.status(400).json({ message: "PIN harus terdiri dari 4 digit." });
        }

        const newEvent = await Event.create({
            image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin, userId: adminEvent 
        });
        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat membuat event." });
    }
}

exports.getEvent = async () => {
    try {
        const events = await Event.findAll();
        return events;
    } catch (error) {
        throw new Error({message: "Terjadi kesalahan saat mengambil semua event."}); 
    }
};

exports.getEventById = async (eventId) => {
    try {
        const event = await Event.findByPk(eventId);
        if (!event) {
            throw new Error("Event tidak ditemukan.");
        }

        return event;
    } catch (error) {
        throw new Error("Terjadi kesalahan saat mengambil event."); 
    }
};


exports.deleteEvent = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Event.destroy({
            where: { id: id }
        });

        if (num == 1) {
            return res.redirect("/event");
        } else {
            return res.json({ success: false, message: `Tidak dapat menghapus event dengan id=${id}. Mungkin event tidak ditemukan!` });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: `Tidak dapat menghapus event dengan id=${id}` });
    }
};

exports.updateEvent = async (req, res) => {
    const id = req.params.id;
    const event = await Event.findByPk(id);
    const { image, title, description, tag, startDate, endDate, winner1, winner2, winner3, pin } = req.body;

    if(!event){
        return res.status(404).json({ message: "Event tidak ditemukan." });
    }

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
        return res.status(400).json({ message: "Nilai tag tidak valid." });
    }

    if (title && title !== event.title) {
        const existingEvent = await Event.findOne({ where: { title: title } });
        if (existingEvent) {
            return res.status(400).json({ message: "Nama event ini telah digunakan." });
        }
    }

    if(pin && pin.length !== 4){
        return res.status(400).json({ message: "PIN harus terdiri dari 4 digit" });
    }

    try {
        const [num] = await Event.update(updateFields, {
            where: { id: id }
        });

        if (num == 1) {
            res.redirect(`/event/${id}`);
        } else {
            res.send({ message: `tidak dapat merubah event dengan id=${id}. Mungkin event tidak ditemukan atau req.body kosong.` });
        }
    } catch (err) {
        res.status(500).send({ message: `Terjadi kesalahan saat merubah event dengan id=${id}` });
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
            return res.status(404).json({ message: "Event tidak ditemukan." });
        } else {
            res.status(200).json(events);
        }
    } catch (error) {
        res.status(500).send({ message: 'Terjadi kesalahan saat mengambil event dengan judul' + title });
    }
}