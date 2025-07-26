import {
  APIApplicationCommandOptionChoice,
  ChatInputCommandInteraction,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import assert from "node:assert";
import Channel, { ChannelType } from "../../data/entities/Channel.js";
import CommandHandler from "./CommandHandler.js";
import database from "../../data/database.js";
import ErrorEmbed from "../../responses/ErrorEmbed.js";
import SuccessEmbed from "../../responses/SuccessEmbed.js";

export default class SetChannel implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Sets up this channel to be of a certain type.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setContexts([InteractionContextType.Guild]);
  cooldown = 0;

  constructor() {
    const choices: APIApplicationCommandOptionChoice<string>[] = [];

    for (const type of Object.values(ChannelType)) {
      choices.push({
        name: type,
        value: type,
      });
    }

    this.data.addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of channel to set")
        .setRequired(true)
        .addChoices(choices),
    );

    this.data.addBooleanOption((option) =>
      option
        .setName("enabled")
        .setDescription("Enable or disable the type for this channel")
        .setRequired(true),
    );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const type = interaction.options.getString("type", true) as ChannelType;

    if (interaction.options.getBoolean("enabled", true)) {
      await this.enableChannelType(interaction, type);
    } else {
      await this.disableChannelType(interaction, type);
    }
  }

  private async enableChannelType(
    interaction: ChatInputCommandInteraction,
    type: ChannelType,
  ): Promise<void> {
    const channels = database.getRepository(Channel);

    assert(
      interaction.guildId,
      "Setting channel type requires a guild context",
    );

    const isAlreadySet = await channels.existsBy({
      channelId: interaction.channelId,
      guildId: interaction.guildId,
      type: interaction.options.getString("type", true) as ChannelType,
    });

    if (isAlreadySet) {
      interaction.reply({
        embeds: [new ErrorEmbed(`this channel is already a ${type} channel.`)],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    const channel = new Channel();

    channel.guildId = interaction.guildId;
    channel.channelId = interaction.channelId;
    channel.type = type as ChannelType;

    await channels.save(channel);

    await interaction.reply({
      embeds: [new SuccessEmbed(`${type} channel set.`)],
      flags: [MessageFlags.Ephemeral],
    });
  }

  private async disableChannelType(
    interaction: ChatInputCommandInteraction,
    type: ChannelType,
  ): Promise<void> {
    const channels = database.getRepository(Channel);

    assert(
      interaction.guildId,
      "Removing channel type requires a guild context",
    );

    const existingChannel = await channels.findOneBy({
      channelId: interaction.channelId,
      guildId: interaction.guildId,
    });

    if (existingChannel === null) {
      await interaction.reply({
        embeds: [
          new ErrorEmbed(
            `this channel is not a set as a ${type} channel.`,
          ),
        ],
        flags: [MessageFlags.Ephemeral],
      });

      return;
    }

    await channels.remove(existingChannel);

    await interaction.reply({
      embeds: [new SuccessEmbed(`${type} channel removed.`)],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
