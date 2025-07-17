import {
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import Command from "./Command.js";
import database from "../../data/database.js";
import WelcomeChannel from "../../data/entities/WelcomeChannel.js";
import assert from "node:assert";
import SuccessEmbed from "../../responses/SuccessEmbed.js";
import ErrorEmbed from "../../responses/ErrorEmbed.js";

export default class SetWelcomeChannel implements Command {
  data = new SlashCommandBuilder()
    .setName("setwelcomechannel")
    .setDescription(
      "Configures whether Methuselah should welcome new members in this channel.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setContexts([InteractionContextType.Guild])
    .addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Turn welcome messages on or off")
        .setRequired(true),
    ) as SlashCommandBuilder;
  cooldown = 0;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (interaction.options.getBoolean("enabled", true)) {
      await this.enableWelcomeChannel(interaction);
    } else {
      await this.disableWelcomeChannel(interaction);
    }
  }

  private async enableWelcomeChannel(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const welcomeChannels = database.getRepository(WelcomeChannel);

    assert(
      interaction.guildId,
      "Setting welcome channel requires a guild context",
    );

    const isAWelcomeChannel = await welcomeChannels.existsBy({
      channelId: interaction.channelId,
      guildId: interaction.guildId,
    });

    if (isAWelcomeChannel) {
      interaction.reply({
        embeds: [new ErrorEmbed("this channel is already a welcome channel.")],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    const welcomeChannel = new WelcomeChannel();

    welcomeChannel.guildId = interaction.guildId;
    welcomeChannel.channelId = interaction.channelId;

    await welcomeChannels.save(welcomeChannel);

    interaction.reply({
      embeds: [new SuccessEmbed("welcome channel set.")],
      flags: [MessageFlags.Ephemeral],
    });
  }

  private async disableWelcomeChannel(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const welcomeChannels = database.getRepository(WelcomeChannel);

    assert(
      interaction.guildId,
      "Removing welcome channel requires a guild context",
    );

    const existingWelcomeChannel = await welcomeChannels.findOneBy({
      channelId: interaction.channelId,
      guildId: interaction.guildId,
    });

    if (existingWelcomeChannel === null) {
      interaction.reply({
        embeds: [new ErrorEmbed("this channel is not a welcome channel.")],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await welcomeChannels.remove(existingWelcomeChannel);

    interaction.reply({
      embeds: [new SuccessEmbed("welcome channel removed.")],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
