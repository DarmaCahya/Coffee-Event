module.exports = (sequelize, Sequelize) => {
  const Coffee = sequelize.define("coffee_flavours", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
    },
    coffee_beans: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    origin: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    flavours: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    acidity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    aftertaste: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    sweetness: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    img: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Coffee;
};
