const Sequelize = require('sequelize');
require('dotenv').config();

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: '127.0.0.1',
        dialect: 'mssql'
    }
);

module.exports = db;