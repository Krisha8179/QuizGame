const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Room = sequelize.define('room' , {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    }
    
});

module.exports = Room;