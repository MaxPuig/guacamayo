import dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, InteractionType, ChannelType } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
import { slash_command } from './utils/slash_commands.js';
import { xgame_continue } from './utils/xgame.js';
import { userJoined } from './utils/voice.js';
import { sendRSS, confirmGame } from './utils/rss.js';
import { ActivityType } from 'discord.js';
import { all_commands_array } from './utils/set_slash_cmds.js';


client.on('ready', async function () {
    console.log('Bot ready!');
    client.user.setActivity('/help', { type: ActivityType.Watching });
    const mins30 = 1_800_000;
    setInterval(sendRSS, mins30, client);
    // client.guilds.cache.forEach(guild => { console.log(`${guild.name} | ${guild.id}`); })
    /** Descomentar esto para crear los slash commands. */
    // 1 Guild
    // await client.guilds.cache.get('123456789')?.commands.set(all_commands_array);
    // Global
    // await client.application?.commands.set([]);
    // await client.application?.commands.set(all_commands_array);
});


client.on('interactionCreate', async interaction => {
    if (interaction.type === InteractionType.ApplicationCommand) { // slash command
        slash_command(interaction, client);
        return;
    }
    await interaction.deferUpdate();
    if (interaction.type === InteractionType.MessageComponent && interaction.isButton()) {
        await confirmGame(interaction, client)
        await xgame_continue(interaction);
    }
});


client.on('voiceStateUpdate', function (oldState, newState) {
    if (newState.channel?.type == ChannelType.GuildStageVoice) return; // Ignores stage channels
    if (newState.channel?.joinable && !newState.channel?.full) {
        userJoined(oldState, newState);
    }
});


client.login(process.env.TOKEN);