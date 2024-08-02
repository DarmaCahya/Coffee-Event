module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("events", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      tag: {
        type: Sequelize.ENUM,
        values: ['completed', 'on-going', 'upcoming'],
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      winner1: {
        type: Sequelize.STRING,
        allowNull: true
      },
      winner2: {
        type: Sequelize.STRING,
        allowNull: true
      },
      winner3: {
        type: Sequelize.STRING,
        allowNull: true
      },
      pin: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  
    return Event;
  };
  