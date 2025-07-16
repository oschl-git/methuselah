export default class EmojiNotFoundError extends Error {
  emojiName?: string;
	guildName?: string;

  constructor(message: string, emojiName?: string, guildName?: string) {
    super(message);

    this.name = "EmojiNotFoundError";
    this.emojiName = emojiName;
		this.guildName = guildName;
  }
}
