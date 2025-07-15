import { ClientEvents } from "discord.js";

export default interface Event<
  T extends keyof ClientEvents = keyof ClientEvents,
> {
  name: T;
  once: boolean;
  execute(...args: ClientEvents[T]): Promise<void>;
}
