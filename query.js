const { QueryTypes } = require('sequelize');
const db = require('./database');

module.exports = {
    getAllUser: async (callback) => {
        const query = 'SELECT * FROM [UserTable]';
        const config = {
            type: QueryTypes.SELECT,
            logging: console.log,
            raw: true
        };
        const result = await db.query(query, config);
        if(!result) {
            return new Error('No data available!');
        } else {
            return result;
        }
    },
    findByUsername: async (Username, callback) => {
        const query = 'SELECT * FROM [UserTable] WHERE Username = ?';
        const config = {
            type: QueryTypes.SELECT,
            replacements: [Username],
            logging: console.log,
            raw: true
        }
        const result = await db.query(query, config);
        if(!result) {
            callback(new Error(`Username ${Username} does not exist`));
        } else {
            callback(null, result);
            return result;
        }
    },
    findById: async (Id, callback) => {
        const query = 'SELECT * FROM [UserTable] WHERE IdUser = ?';
        const config = {
            type: QueryTypes.SELECT,
            replacements: [Id],
            logging: console.log,
            raw: true
        }
        const result = await db.query(query, config);
        if(!result) {
            callback(new Error(`Iduser ${Username} does not exist`));
        } else {
            callback(null, result);
            return result;
        }
    }
}