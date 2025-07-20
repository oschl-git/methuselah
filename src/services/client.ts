import { Client, GatewayIntentBits, Partials } from "discord.js";
import config from "config";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
});

await client.login(config.get<string>("token"));

await new Promise<void>((resolve) => {
  if (client.isReady()) return resolve();
  (client as Client).once("ready", () => resolve());
});

export default client as Client<true>;
