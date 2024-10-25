const db = require("../models");
const kopi = db.coffee;
const Op = db.Sequelize.Op;

exports.createCoffee = async (req, res) => {
    try {
        const { coffee_name, coffee_img, coffee_origin, coffee_type, flavor_notes } = req.body;  
        if (!coffee_name || !coffee_img || !coffee_origin || !coffee_type || !flavor_notes) {
            return res.status(400).json({ message: "Semua field harus terisi!" });
        }

        const existingCoffee = await kopi.findOne({ where: { coffee_name: coffee_name } });
        if (existingCoffee) {
            return res.status(400).json({ message: "Nama Kopi ini sudah digunakan." });
        }

        const newCoffee = await kopi.create({
            coffee_name,
            coffee_img,
            coffee_origin,
            coffee_type,
            flavor_notes
        });

        res.redirect('/admin/dashboard');
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat membuat Kopi." });
    }
}

exports.getCoffee = async () => {
    try {
        const coffees = await kopi.findAll();
        return coffees;
    } catch (error) {
        throw new Error({message: "Terjadi kesalahan saat mengambil daftar kopi."}); 
    }
};

exports.getCoffeeById = async (coffeeId) => {
    try {
        const coffee = await kopi.findByPk(coffeeId);
        if (!coffee) {
            throw new Error("Kopi tidak ditemukan");
        }

        return coffee;
    } catch (error) {
        throw new Error({message: "Terjadi kesalahan saat mengambil kopi."}); 
    }
};

