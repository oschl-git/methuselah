import { Client, GatewayIntentBits } from "discord.js";
import config from "config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

await client.login(config.get<string>("token"));

await new Promise<void>((resolve) => {
  if (client.isReady()) return resolve();
  (client as Client).once("ready", () => resolve());
});

export default client as Client<true>;
