const postgres = require('postgres');
const { db } = require('../config.json');

const sql = postgres({
	host: db['host'],
	port: db['port'],
	database: db['database'],
	username: db['username'],
	password: db['password'],
});

async function testDatabaseConnection() {
	try {
		await sql`
			select 1;
		`;
	} catch (e) {
		console.error(e);
		return false;
	}
	return true;
}

module.exports = {
	sql,
	testDatabaseConnection,
};