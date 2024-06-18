const { sql } = require('./db.js');


async function isWelcomeChannel(channelId) {
	let result = await sql`
	  select id
	  from welcome_channels
	  where channel_id = ${channelId}
	`;
	return result.length > 0;
}

async function saveWelcomeChannel(channelId) {
	if (await isWelcomeChannel(channelId)) return;
	await sql`
		insert into welcome_channels
		(channel_id)
		values(${channelId})
	`;
};

async function deleteWelcomeChannel(channelId) {
	await sql`
		delete from welcome_channels
		where channel_id = ${channelId};
	`;
}

async function getWelcomeChannelIds() {
	const result = await sql`
		select channel_id
		from welcome_channels;
	`;

	let output = [];
	for (const row of result) {
		output.push(row.channel_id);
	}
	return output;
}


module.exports = {
	isWelcomeChannel,
	saveWelcomeChannel,
	deleteWelcomeChannel,
	getWelcomeChannelIds,
};