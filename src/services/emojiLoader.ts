import { Guild } from "discord.js";
import client from "./client.js";
import EmojiNotFoundError from "../errors/EmojiNotFoundError.js";

export async function getEmojiId(name: string, guild?: Guild): Promise<string> {
  let id = null;

  if (guild) {
    id = guild.emojis.cache.find((emoji) => emoji.name === name)?.id;
  }

  if (!id) {
    id = (await client.application.emojis.fetch()).find(
      (emoji) => emoji.name === name,
    )?.id;
  }

  if (!id) {
    throw new EmojiNotFoundError(`Emoji not found`, name, guild?.name);
  }

  return id;
}

export async function getEmojiString(
  name: string,
  guild?: Guild,
): Promise<string> {
  const emojiId = await getEmojiId(name, guild);

  return `<:${name}:${emojiId}>`;
}

export async function tryGetEmojiString(
  name: string,
  guild?: Guild,
): Promise<string | null> {
  try {
    return await getEmojiString(name, guild);
  } catch (error) {
    if (error instanceof EmojiNotFoundError) {
      return null;
    }

    throw error;
  }
}
