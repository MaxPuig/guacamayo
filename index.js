import dotenv from 'dotenv';
dotenv.config();
import { Client } from 'discord.js';
const client = new Client({ intents: 129 }); // https://ziad87.net/intents/
import { slash_command } from './utils/slash_commands.js';
import { addDeleteUser } from './utils/lists.js';
import { xgame_continue } from './utils/xgame.js';
import { userJoined } from './utils/voice.js';
import { sendRSS } from './utils/rss.js';


client.on('ready', async function () {
    console.log('Bot ready!');
    const mins15 = 900000;
    setInterval(sendRSS, mins15, client);
    // client.guilds.cache.forEach(guild => { console.log(`${guild.name} | ${guild.id}`); })
});


client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) { // slash command
        slash_command(interaction);
        return;
    }
    await interaction.deferUpdate();
    if (interaction.isMessageComponent() && interaction.componentType == 'BUTTON') {
        await xgame_continue(interaction);
        await addDeleteUser(interaction);
    }
});


client.on('voiceStateUpdate', function (oldState, newState) {
    if (newState.channel?.type == 'GUILD_STAGE_VOICE') return; // Ignores stage channels
    userJoined(oldState, newState)
});


client.login(process.env.TOKEN);