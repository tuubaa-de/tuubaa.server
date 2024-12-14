import {Client, ClientOptions, Events} from "discord.js";
import {configDotenv} from "dotenv";
import {MoonlinkManager} from "moonlink.js";

export class ClientWrapper extends Client {

	player: MoonlinkManager = new MoonlinkManager(
		[
			{
				host: "tuubaa.de",
				port: 2333,
				secure: false,
				password: process.env["LAVALINK_PASSWORD"]!,
			},
		],
		{
			/* Options */
		},
		(guild: string, sPayload: string) => {
			// Sending payload information to the server
			this.guilds.cache.get(guild)!.shard.send(JSON.parse(sPayload));
		}
	);

	constructor(options: ClientOptions) {
		configDotenv();
		super(options);

		this.on(Events.ClientReady, (client) => {
			this.player.init(client.user.id);
		});

		this.on(Events.Raw, (data) => {
			this.player.packetUpdate(data);
		});
	}
}
