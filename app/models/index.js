const config = require("../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/userModel.js")(sequelize, Sequelize);
db.event = require("../models/eventModel.js")(sequelize, Sequelize);
db.score = require("../models/scoreModel.js")(sequelize, Sequelize);

db.event.hasMany(db.score, { foreignKey: 'eventId', onDelete: 'CASCADE' });
db.score.belongsTo(db.event, { foreignKey: 'eventId', onDelete: 'CASCADE' });

db.user.hasMany(db.score, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.score.belongsTo(db.user, { foreignKey: 'userId', onDelete: 'CASCADE' });

db.ROLES = ["jury", "admin"];

module.exports = db;