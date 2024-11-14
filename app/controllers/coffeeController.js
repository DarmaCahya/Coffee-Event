const db = require("../models");
const kopi = db.coffee;
const Op = db.Sequelize.Op;

exports.createCoffee = async (req, res) => {
    try {
        const { coffee_beans, origin, flavours, acidity, body, aftertaste, sweetness, img } = req.body; 
        console.log(req.body)
 
        if (!coffee_beans || !origin || !flavours || !acidity || !body || !aftertaste || !sweetness || !img) {
            return res.status(400).json({ message: "Semua field harus terisi!" });
        }
        console.log(req.body)

        const existingCoffee = await kopi.findOne({ where: { coffee_beans: coffee_beans } });
        if (existingCoffee) {
            return res.status(400).json({ message: "Nama Kopi ini sudah digunakan." });
        }

        const newCoffee = await kopi.create({
            coffee_beans,
            origin,
            flavours,
            acidity,
            body,
            aftertaste,
            sweetness,
            img
        });

        res.redirect('/coffee-flavours');
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat membuat Kopi."});
    }
};

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

exports.deleteCoffee = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await kopi.destroy({
            where: { id: id }
        });

        if (num == 1) {
            return res.redirect("/coffee-flavours");
        } else {
            return res.json({ success: false, message: `Tidak dapat menghapus Kopi dengan id=${id}. Mungkin Kopi tidak ditemukan!` });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: `Tidak dapat menghapus Kopi dengan id=${id}` });
    }
};

exports.updateCoffee = async (req, res) => {
    const id = req.params.id;
    const coffee = await kopi.findByPk(id);
    const { coffee_beans, origin, flavours, acidity, body, aftertaste, sweetness, img } = req.body; 

    if(!coffee){
        return res.status(404).json({ message: "Kopi tidak ditemukan." });
    }

    let updateFields = {};
    if (coffee_beans) updateFields.coffee_beans = coffee_beans;
    if (origin) updateFields.origin = origin;
    if (flavours) updateFields.flavours = flavours;
    if (acidity != null) updateFields.acidity = acidity;
    if (body != null) updateFields.body = body;
    if (aftertaste != null) updateFields.aftertaste = aftertaste;
    if (sweetness != null) updateFields.sweetness = sweetness;
    if (img) updateFields.img = img;

    if (coffee_beans && coffee_beans !== coffee.coffee_beans) {
        const existingCoffee = await kopi.findOne({ where: { coffee_beans: coffee_beans } });
        if (existingCoffee) {
            return res.status(400).json({ message: "Nama kopi ini telah digunakan." });
        }
    }

    try {
        const [num] = await kopi.update(updateFields, {
            where: { id: id }
        });

        if (num == 1) {
            res.redirect(`/coffee-flavours`);
        } else {
            res.send({ message: `Tidak dapat merubah kopi dengan id=${id}. Mungkin kopi tidak ditemukan atau req.body kosong.` });
        }
    } catch (err) {
        res.status(500).send({ message: `Terjadi kesalahan saat merubah kopi dengan id=${id}` });
    }
};