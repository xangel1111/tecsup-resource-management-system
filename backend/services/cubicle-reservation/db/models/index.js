'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
require('dotenv').config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const config = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME || 'database_development',
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: process.env.DB_DIALECT || 'mysql',
};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Cubicle = require('./cubicle')(sequelize, Sequelize.DataTypes);
db.Reservation = require('./reservation')(sequelize, Sequelize.DataTypes);

db.Cubicle.hasMany(db.Reservation, { foreignKey: 'cubicleId' });
db.Reservation.belongsTo(db.Cubicle, { foreignKey: 'cubicleId' });

module.exports = db;
