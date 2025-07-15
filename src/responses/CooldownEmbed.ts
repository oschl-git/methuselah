import { Colors, EmbedBuilder } from "discord.js";

export default class CooldownEmbed extends EmbedBuilder {
  constructor(commandName: string) {
    super();

    this.setDescription(
      `:clock4: command \`/${commandName}\` is on cooldown, try again in a few seconds.`,
    );
    this.setColor(Colors.Orange);
  }
}
