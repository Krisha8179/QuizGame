const Sequelize = require('sequelize');
require("dotenv").config();

const sequelize = new Sequelize(`${process.env.MYSQL_SCHEMA}`,`${process.env.MYSQL_USER}`,`${process.env.MYSQL_PASSWORD}`, {
    dialect: 'mysql',
    host: `${process.env.DB_HOST}`,
    port: 3306
});

module.exports = sequelize;