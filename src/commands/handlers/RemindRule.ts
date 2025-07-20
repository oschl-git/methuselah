import {
  ChatInputCommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import * as emojiLoader from "../../services/emojiLoader.js";
import * as resourceLoader from "../../resources/resourceLoader.js";
import CommandHandler from "./CommandHandler.js";
import ErrorEmbed from "../../responses/ErrorEmbed.js";
import InfoEmbed from "../../responses/InfoEmbed.js";

const rules = resourceLoader.loadYaml<string[]>("rules");

export default class RemindRule implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("remindrule")
    .setDescription("Reminds a server rule.")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Number of the rule")
        .setRequired(true),
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const number = interaction.options.getInteger("number", true);

    if (number < 1 || number > rules.length) {
      await interaction.reply({
        embeds: [
          new ErrorEmbed(`rule number must be between 1 and ${rules.length}.`),
        ],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    const emoji = await emojiLoader.tryGetEmojiString(
      "methuselah",
      interaction.member instanceof GuildMember
        ? interaction.member.guild
        : undefined,
    );

    const rule = rules[number - 1];

    await interaction.reply({
      content: `> ${emoji} *remember rule ${number}:*\n`,
      embeds: [new InfoEmbed(`**${rule}**`)],
    });
  }
}
