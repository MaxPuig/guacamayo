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
    client.user.setActivity('/help', { type: 'WATCHING' });
    const mins15 = 900000;
    setInterval(sendRSS, mins15, client);
    // client.guilds.cache.forEach(guild => { console.log(`${guild.name} | ${guild.id}`); })
    /** Descomentar esto para crear los slash commands al enviar un mensaje en cualquier canal.
    import { all_commands_array } from './utils/set_slash_cmds.js';
    // 1 Guild
    await client.guilds.cache.get('123456789')?.commands.set(all_commands_array);
    // Global
    await client.application?.commands.set([]);
    await client.application?.commands.set(all_commands_array);
     */
});


client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) { // slash command
        slash_command(interaction, client);
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
    if (newState.channel?.joinable && !newState.channel?.full) {
        userJoined(oldState, newState);
    }
});


client.login(process.env.TOKEN);