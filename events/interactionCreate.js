const { Events, Collection, EmbedBuilder, Colors } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		client = interaction.client;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		const { cooldowns } = client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const defaultCooldownDuration = 1;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const embed = new EmbedBuilder()
					.setDescription(':clock4: command on cooldown, try again in a few seconds.')
					.setColor(Colors.Orange);
				interaction.reply({ embeds: [embed], ephemeral: true });
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			const embed = new EmbedBuilder()
				.setDescription(`**✕** failed to execute command \`${interaction.commandName}\`.`)
				.setColor(Colors.Red);
			interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};
