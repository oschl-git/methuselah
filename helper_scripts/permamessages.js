const fs = require('node:fs');
const path = require('node:path');

const jsonPath = '../command_config/permamessages.json';

const getPermamessageMapFromJson = () => {
	let data;
	const filePath = path.join(__dirname, jsonPath);

	if (fs.existsSync(filePath)) {
		try {
			data = fs.readFileSync(filePath);
		}
		catch (error) {
			console.error('[CRITICAL] Failed reading permamessage JSON. Exiting...');
			console.error(error);
			throw error;
		}
	}
	else {
		data = new Map();
	}

	return new Map(Object.entries(JSON.parse(data)));
};

const savePermamessageMapToJson = (permamessageMap) => {
	const data = JSON.stringify(Object.fromEntries(permamessageMap), null, '\t');
	const filePath = path.join(__dirname, jsonPath);

	try {
		fs.writeFileSync(filePath, data);
	}
	catch (error) {
		console.error('[CRITICAL] Failed saving permamessage JSON. Exiting...');
		console.error(error);
		throw error;
	}
};

module.exports = {
	getPermamessageMapFromJson,
	savePermamessageMapToJson,
};