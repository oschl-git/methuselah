import { Colors, EmbedBuilder } from "discord.js";

export default class ErrorEmbed extends EmbedBuilder {
    constructor(message: string) {
        super();

        this.setDescription(`**✕** ${message}`);
        this.setColor(Colors.Red);
    }
}
