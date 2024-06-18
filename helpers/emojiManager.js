function getEmojiByName(name, client) {
	try {
		const id = client.guild.emojis.cache.find(emoji => emoji.name === name).id;
		return `<:${name}:${id}>`;
	}
	catch {
		return '';
	}
}

module.exports = {
	getEmojiByName,
};