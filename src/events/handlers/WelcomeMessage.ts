import { Events, GuildMember } from "discord.js";
import Event from "./Event.js";

export default class WelcomeMessage implements Event<Events.GuildMemberAdd> {
	name = Events.GuildMemberAdd as const;
	once = false;

	async execute(member: GuildMember): Promise<void> {
		// @TODO implement logic
		
		console.log(member.user.username, "has joined the server!");
	}
}
