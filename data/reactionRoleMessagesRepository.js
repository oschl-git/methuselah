const { sql } = require('./db.js');


async function isReactionRoleMessage(messageId) {
	let result = await sql`
	  select id
	  from reaction_roles_messages
	  where message_id = ${messageId}
	`;
	return result.length > 0;
}

async function saveMessage(messageId) {
	if (await isReactionRoleMessage(messageId)) return;
	await sql`
		insert into reaction_roles_messages
		(message_id)
		values(${messageId})
	`;
};


module.exports = {
	isReactionRoleMessage,
	saveMessage,
};