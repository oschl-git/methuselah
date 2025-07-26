import {
  APIApplicationCommandOptionChoice,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import CommandHandler from "./CommandHandler.js";
import * as resourceLoader from "../../resources/resourceLoader.js";

interface InviteEntry {
  server: string;
  invite: string;
}

const invites = resourceLoader.loadYaml<InviteEntry[]>("invites");

export default class SendInvite implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("sendinvite")
    .setDescription("Sends an invite to another Discord server.");

  constructor() {
    const choices: APIApplicationCommandOptionChoice<string>[] = [];

    for (const invite of invites) {
      choices.push({
        name: invite.server,
        value: invite.server,
      });
    }

    this.data.addStringOption((option) =>
      option
        .setName("server")
        .setDescription("Server to send the invite for")
        .setRequired(true)
        .setChoices(choices),
    );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const serverName = interaction.options.getString("server", true);

    for (const invite of invites) {
      if (invite.server === serverName) {
        await interaction.reply(invite.invite);
        return;
      }
    }

		throw new Error("Send invite command called with unknown server name");
  }
}
