import { Guild } from "discord.js";
import client from "./client.js";
import EmojiNotFoundError from "../errors/EmojiNotFoundError.js";

export function getEmoji(name: string, guild?: Guild): string {
  let id = null;
  
  if (guild) {
    id = guild.emojis.cache.find((emoji) => emoji.name === name)?.id;
  }

  if (!id) {
    id = client.emojis.cache.find((emoji) => emoji.name === name)?.id;
  }

  if (!id) {
    throw new EmojiNotFoundError(`Emoji not found`, name, guild?.name);
  }

  return `<:${name}:${id}>`;
}

export function tryGetEmoji(name: string, guild?: Guild): string | null {
  try {
    return getEmoji(name, guild);
  } catch (error) {
    if (error instanceof EmojiNotFoundError) {
      return null;
    }

    throw error;
  }
}
