import { ClientEvents } from "discord.js";

export default interface EventHandler<
  T extends keyof ClientEvents = keyof ClientEvents,
> {
  name: T;
  once: boolean;
  execute(...args: ClientEvents[T]): Promise<void>;
}
