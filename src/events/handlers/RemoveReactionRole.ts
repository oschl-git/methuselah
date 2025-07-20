import { Events, MessageReaction, User } from "discord.js";
import assert from "node:assert";
import database from "../../data/database.js";
import EventHandler from "./EventHandler.js";
import logger from "../../services/logger.js";
import ReactionRole from "../../data/entities/ReactionRole.js";

export default class RemoveReactionRole
  implements EventHandler<Events.MessageReactionRemove>
{
  name = Events.MessageReactionRemove as const;
  once = false;

  async execute(reaction: MessageReaction, user: User): Promise<void> {
    if (user.bot) {
      return;
    }

    if (reaction.partial) {
      await reaction.fetch();
    }

    if (reaction.message.partial) {
      await reaction.message.fetch();
    }

    if (reaction.message.guild === null) {
      return;
    }

    if (user.bot) {
      return;
    }

    const emoji = reaction.emoji.id ?? reaction.emoji.name;

    assert(emoji !== null, "Emoji must be defined");

    const reactionRoles = database.getRepository(ReactionRole);

    const reactionRole = await reactionRoles.findOneBy({
      messageId: reaction.message.id,
      emoji: emoji,
    });

    if (reactionRole === null) {
      return;
    }

    const member = await reaction.message.guild.members.fetch(user.id);

    await member.roles.remove(reactionRole.roleId);

    logger.info(
      `Removed role ${reactionRole.roleId} from user [@${user.username}] for reaction ${emoji} on message ` +
        `${reaction.message.id}`,
    );
  }
}
