const { sql } = require('./db.js');


async function doesChannelHavePermamessage(channelId) {
	let result = await sql`
	  select id
	  from permamessages
	  where channel_id = ${channelId}
	`;

	return result.length > 0;
}

async function savePermamessage(
	channelId,
	sentMessageId,
	content
) {
	if (! await doesChannelHavePermamessage(channelId)) {
		await sql`
			insert into permamessages
			(channel_id, sent_message_id, content)
			values(${channelId}, ${sentMessageId}, ${content})
		`;
	}
	else {
		await sql`
			update permamessages
			set sent_message_id = ${sentMessageId}, content = ${content} 
			where channel_id = ${channelId};
		`;
	}
};

async function deletePermamessageByChannelId(channelId) {
	await sql`
		delete from permamessages
		where channel_id = ${channelId};
	`;
}

async function getPermamessageByChannelId(channelId) {
	let query = await sql`
		select *
		from permamessages
		where channel_id = ${channelId};
	`;
	return query[0];
}


module.exports = {
	doesChannelHavePermamessage,
	savePermamessage,
	deletePermamessageByChannelId,
	getPermamessageByChannelId
};