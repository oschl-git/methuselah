import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
  PermissionsBitField,
  InteractionContextType,
} from "discord.js";
import * as resourceLoader from "../../resources/resourceLoader.js";
import CommandHandler from "./CommandHandler.js";
import handlebars from "handlebars";
import manifest from "../../../package.json" with { type: "json" };
import InfoEmbed from "../../responses/InfoEmbed.js";

interface HelpCommandEntry {
  definition: string;
  description: string;
  requiredPermission?: string;
}

const markdownBase = resourceLoader.loadMarkdown("help");
const helpCommands =
  resourceLoader.loadYaml<HelpCommandEntry[]>("helpCommands");

export default class Help implements CommandHandler {
  data = new SlashCommandBuilder()
    .setName("help")
    .setContexts(InteractionContextType.Guild)
    .setDescription("Displays information and available commands.");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const commands: HelpCommandEntry[] = [];

    const memberPermissions = interaction.member
      ?.permissions as Readonly<PermissionsBitField>;
    for (const command of helpCommands) {
      if (
        command.requiredPermission &&
        !memberPermissions.has(
          PermissionFlagsBits[
            command.requiredPermission as keyof typeof PermissionFlagsBits
          ],
        )
      ) {
        continue;
      }

      commands.push(command);
    }

    const content = handlebars.compile(markdownBase)({
      version: manifest.version,
      commands: commands,
    });

    await interaction.reply({
      embeds: [new InfoEmbed(content)],
      flags: [MessageFlags.Ephemeral],
    });
  }
}
