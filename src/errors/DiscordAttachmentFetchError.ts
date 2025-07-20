export default class DiscordAttachmentFetchError extends Error {
  emojiName?: string;
  guildName?: string;

  constructor(message: string) {
    super(message);

    this.name = "DiscordAttachmentFetchError";
  }
}
