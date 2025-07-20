import { Events, MessageReaction, User } from "discord.js";
import EventHandler from "./EventHandler.js";
import assert from "node:assert";
import database from "../../data/database.js";
import ReactionRole from "../../data/entities/ReactionRole.js";

export default class RemoveReactionRole
  implements EventHandler<Events.MessageReactionRemove>
{
  name = Events.MessageReactionRemove as const;
  once = false;

  async execute(reaction: MessageReaction, user: User): Promise<void> {
    if (reaction.partial) {
      await reaction.fetch();
    }

    if (reaction.message.partial) {
      await reaction.message.fetch();
    }

    if (reaction.message.guild === null) {
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

    member.roles.remove(reactionRole.roleId);
  }
}
