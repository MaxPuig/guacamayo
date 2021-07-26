import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'discord.js';
const client = new Client({ intents: 1665 }); // https://ziad87.net/intents/
import { readFileSync } from 'fs';
import { xgame_start, xgame_continue } from './utils/xgame.js';
import { changePrefix } from './utils/change_prefix.js';
import { startList, addDeleteUser } from './utils/lists.js';
import { sendRSS, setRSSchannel, deleteRSSchannel } from './utils/rss.js';
import { disable_enable_voice, userJoined } from './utils/voice.js';
import { relayMsg } from './utils/relay_msg.js';
import { first_execution } from './utils/firstSetup.js';
import { sendHelpCommands } from './utils/help.js';
// import { start_test, test_continue } from './utils/tests_autoescuela.js';
let prefixes, channels;


client.on('ready', async function () {
    console.log('Bot ready!');
    first_execution();
    prefixes = JSON.parse(readFileSync('./data/customPrefix.json', 'utf-8'));
    channels = JSON.parse(readFileSync('./data/channels.json', 'utf-8'));
    const mins15 = 900000;
    setInterval(sendRSS, mins15, client);
});


client.on('messageCreate', async function (msg) {
    if (msg.webhookId != null) return; // Ignores webhooks
    let prefix;
    if (prefixes[msg.guild.id] != undefined) { prefix = prefixes[msg.guild.id]; } else { prefix = "." }; // sets the custom prefix
    if (msg.content.startsWith(prefix)) {
        prefixes = changePrefix(msg, prefixes, prefix);
        xgame_start(msg, prefix);
        startList(msg, prefix);
        sendHelpCommands(msg, prefix);
        setRSSchannel(msg, prefix);
        deleteRSSchannel(msg, prefix);
        disable_enable_voice(msg, prefix);
        // start_test(msg, prefix);
    }
    channels = relayMsg(msg, client, channels, prefix);
});


client.on('interactionCreate', async interaction => {
    await interaction.deferUpdate();
    if (!interaction.isMessageComponent() && interaction.componentType !== 'BUTTON') return;
    await xgame_continue(interaction);
    await addDeleteUser(interaction);
    // await test_continue(interaction);
});


client.on('voiceStateUpdate', function (oldState, newState) {
    if (newState.channel?.type == 'GUILD_STAGE_VOICE') return; // Ignores stage channels
    userJoined(oldState, newState)
});


client.login(process.env.TOKEN);