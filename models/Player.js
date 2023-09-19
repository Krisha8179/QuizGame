const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Player = sequelize.define('player' , {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: Sequelize.STRING,
    score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
    
});

module.exports = Player;