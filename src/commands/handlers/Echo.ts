import {
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import * as echoMessageManager from "../../services/echoMessageManager.js";
import CommandHandler from "./CommandHandler.js";
import SuccessEmbed from "../../responses/SuccessEmbed.js";

export default class Echo implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("echo")
    .setDescription(
      "The next message you send will be deleted and written by the bot instead.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    echoMessageManager.addEntry(interaction.user.id, interaction.channelId);

    await interaction.reply({
      embeds: [
        new SuccessEmbed(
          `you have ${echoMessageManager.echoMessageTimeout} seconds to write your message.`,
        ),
      ],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
