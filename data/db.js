const postgres = require('postgres');
const { db } = require('../config.json');

const sql = postgres({
	host: db['host'],
	port: db['port'],
	database: db['database'],
	username: db['username'],
	password: db['password'],
});

module.exports = {
	sql,
};