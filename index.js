require('dotenv').config();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: 1665 }); // https://ziad87.net/intents/
const fs = require('fs');
const xgame = require('./utils/xgame.js');
const customPrefix = require('./utils/change_prefix.js');
const list = require('./utils/lists.js');
const rss = require('./utils/rss.js');
const tts = require('./utils/voice.js');
const relay = require('./utils/relay_msg.js');
const firstSetup = require('./utils/firstSetup.js');
const help = require('./utils/help.js');
// const test = require('./utils/tests_autoescuela.js');
let prefixes, channels;


client.on('ready', async function () {
    console.log('Bot ready!');
    firstSetup.first_execution();
    prefixes = JSON.parse(fs.readFileSync('./data/customPrefix.json', 'utf-8'));
    channels = JSON.parse(fs.readFileSync('./data/channels.json', 'utf-8'));
    const mins15 = 900000;
    setInterval(rss.sendRSS, mins15, client);
});


client.on('messageCreate', async function (msg) {
    if (msg.webhookId != null) return; // Ignores webhooks
    if (prefixes[msg.guild.id] != undefined) { prefix = prefixes[msg.guild.id]; } else { prefix = "." }; // sets the custom prefix
    if (msg.content.startsWith(prefix)) {
        prefixes = customPrefix.changePrefix(msg, prefixes);
        xgame.xgame_start(msg, prefix);
        list.startList(msg, prefix);
        help.sendHelpCommands(msg, prefix);
        rss.setRSSchannel(msg, prefix);
        rss.deleteRSSchannel(msg, prefix);
        tts.disable_enable_voice(msg, prefix);
        channels = relay.relayMsg(msg, prefix, channels);
        // test.start_test(msg, prefix);
    }
});


client.on('interactionCreate', async interaction => {
    await interaction.deferUpdate();
    if (!interaction.isMessageComponent() && interaction.componentType !== 'BUTTON') return;
    await xgame.xgame_continue(interaction);
    await list.addDeleteUser(interaction);
    // await test.test_continue(interaction);
});


client.on('voiceStateUpdate', function (oldState, newState) {
    if (newState.channel?.type == 'GUILD_STAGE_VOICE') return; // Ignores stage channels
    tts.userJoined(oldState, newState)
});


client.login(process.env.TOKEN);