import {ActivityType, TextChannel} from "discord.js";
import {client} from "../../bot";
import {router} from "../../endpoint";
import {snowflake} from "../../lib/snowflake";
import {Module} from "../../types/module";

export const readyRouter = router({});

async function entry() {

	console.log(`Client loaded with ${client.user?.tag}`);
	snowflake.updateMember("time", "795306274467348510");
	snowflake.updateMember("tuubaa", "624623721587408896");

	snowflake.updateRole("user", "1009762884626169947");
	snowflake.updateRole("ban", "1183177169120268328");
	snowflake.updateRole("team", "1092209824508411914");

	snowflake.updateRole("admin", "1139287301848043632");

	snowflake.updateRole("owner", "1009763136586387467");
	snowflake.updateRole("dev", "1009767438071648296");
	snowflake.updateRole("manager", "1224092798924492921");
	snowflake.updateRole("mod", "1009767209259765912");
	snowflake.updateRole("emotes", "1221458480091893892");

	snowflake.updateRole("upgrader", "1041351990728478852");
	snowflake.updateRole("friend", "1031295240281268284");
	snowflake.updateRole("youtube", "1009767553767313418");
	snowflake.updateRole("artist", "1188103824028737546");

	snowflake.updateRole("levellingRole6", "1090728365490720799");
	snowflake.updateRole("levellingRole5", "1247254976888307763");
	snowflake.updateRole("levellingRole4", "1090728235765084183");
	snowflake.updateRole("levellingRole3", "1090728047721844796");
	snowflake.updateRole("levellingRole2", "1245722673984704542");
	snowflake.updateRole("levellingRole1", "1009762884626169947");

	snowflake.updateRole("teamSplitter", "1237533652292997191");
	snowflake.updateRole("specialSplitter", "1237536627182665871");
	snowflake.updateRole("personalySplitter", "1237534924354093057");
	snowflake.updateRole("pingsSplitter", "1246958218823864332");

	snowflake.updateChannel("memberCount", "1091828921089130608");
	snowflake.updateChannel("general", "1009764889641897985");
	snowflake.updateChannel("bot", "1183107206934171769");
	snowflake.updateChannel("log", "1244796635167592570");
	snowflake.updateChannel("mod", "1244805179493322843");
	snowflake.updateChannel("normal", "1092133436308861029");
	snowflake.updateChannel("private", "1247262718654808177");
	snowflake.updateChannel("waiting", "1247317729749373039");
	snowflake.updateChannel("rules", "1009764692891287582");
	snowflake.updateChannel("introduce", "1044232081804378182");
	snowflake.updateChannel("support", "1009800250908758066");
	snowflake.updateChannel("welcome", "1009762551636172850");

	if (client.user) {
		client.user.setPresence({
			activities: [
				{
					name: "tuubaa",
					type: ActivityType.Watching,
					url: "http://tuubaa.de/",
				},
			],
			status: "online",
		});
	}

	const channel = snowflake.channels.memberCount;

	if (!channel) {
		console.log("Member Count Channel existert irgendwie nicht!");
		return;
	}

	let memberCount = 0;

	setInterval(async () => {
		// info(">> Checking for new Members");
		updateMemberCount(channel, memberCount);
	}, 6 * 60 * 1000);

}

export const ready = new Module({
	name: "ready",
	commands: [],
	entry: entry,
});

async function updateMemberCount(channel: TextChannel, memberCount: number) {
	let member = null;

	try {
		member = (await snowflake.guild.members.fetch()).size;
	} catch (err: any) {
		console.log(err);
		return;
	}
	if (memberCount === member) return;

	if (!channel) {
		console.log("Member Count Channel existert irgendwie nicht!");
		return;
	}

	await channel.setName("「👥」Kinder✩" + member);

	memberCount = member;
}
