import { EmbedBuilder } from "discord.js";

export default class InfoEmbed extends EmbedBuilder {
  constructor(content: string) {
    super();

    this.setDescription(content);
  }
}
