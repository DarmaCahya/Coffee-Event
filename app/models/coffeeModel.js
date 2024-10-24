module.exports = (sequelize, Sequelize) => {
    const coffee = sequelize.define("coffee_sample", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        coffee_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        coffee_img: {
            type: Sequelize.STRING,
            allowNull: false
        },
        coffee_origin: {
            type: Sequelize.STRING,
            allowNull: false
        },
        coffee_type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        flavor_notes: {
            type: Sequelize.TEXT,
            allowNull : false
        }
    });
    return coffee;
  };