const fs = require('node:fs');
const path = require('node:path');

const jsonPath = '../data/welcomeChannels.json';

const getWelcomeChannelsFromJson = () => {
	let data;
	const filePath = path.join(__dirname, jsonPath);

	try {
		data = fs.readFileSync(filePath);
	}
	catch (error) {
		console.error('[CRITICAL] Failed reading welcomeChannels JSON. Exiting...');
		console.error(error);
		throw error;
	}

	return JSON.parse(data);
};

const saveWelcomeChannelsToJson = (welcomeChannels) => {
	const data = JSON.stringify(welcomeChannels, null, '\t');
	const filePath = path.join(__dirname, jsonPath);

	try {
		fs.writeFileSync(filePath, data);
	}
	catch (error) {
		console.error('[CRITICAL] Failed saving welcomeChannels JSON. Exiting...');
		console.error(error);
		throw error;
	}
};

module.exports = {
	getWelcomeChannelsFromJson,
	saveWelcomeChannelsToJson,
};