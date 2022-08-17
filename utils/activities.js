import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { EmbedBuilder } from 'discord.js';
import { getDatabase, setDatabase } from './database.js';
const token = process.env.TOKEN.toString();


/** Devuelve un embed con una actividad para jugar en un canal de voz. */
async function getActivity(channelId, applicationId, guildId, client) {
    let datos = await getDatabase('activities');
    if (!datos[guildId]) {
        datos[guildId] = {};
        datos[guildId][channelId] = {};
    }
    if (!datos[guildId][channelId]) datos[guildId][channelId] = {};
    if (!datos[guildId][channelId][applicationId]) {
        return await createInvite(channelId, applicationId, guildId, datos);
    } else { // Check if invite is still valid
        return await checkInvite(client, datos[guildId][channelId][applicationId], channelId, applicationId, guildId, datos);
    }
}


/** Crea una link/invitación para unirse a un canal de voz. */
async function createInvite(channelId, applicationId, guildId, datos) {
    let error, embed;
    try {
        await fetch(`https://discord.com/api/v8/channels/${channelId}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 0,
                max_uses: 0,
                target_application_id: applicationId,
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": 'Bot ' + token,
                "Content-Type": "application/json"
            }
        }).then(body => body.json()).then(function (invite) {
            if (invite.code === 50013) error = 50013;
            else if (invite.code === 10003) error = 10003;
            else if (invite.error || !invite.code) error = 'error';
            else {
                const link = 'https://discord.gg/' + invite.code;
                datos[guildId][channelId][applicationId] = link;
                embed = createEmbed(invite.target_application.name, invite.channel.name, link);
                setDatabase('activities', datos);
            }
        });
        if (error == 50013) return { content: 'El bot no tiene permiso para crear invitaciones.', ephemeral: true };
        else if (error == 10003) return { content: 'El canal no existe.', ephemeral: true };
        else if (error == 'error') return { content: 'Ha sucedido un error.', ephemeral: true };
        else return { embeds: [embed] };
    } catch (err) {
        return { content: 'Ha sucedido un error.', ephemeral: true };
    }
}


/** Comprueba si la invitación de la db sigue activa, si no, crea una nueva. */
async function checkInvite(client, invite, channelId, applicationId, guildId, datos) {
    let valid, channelName, appName;
    await client.fetchInvite(invite).then(inv => {
        valid = true;
        channelName = inv.channel.name;
        appName = inv.target_application.name;
    }).catch(err => {
        valid = false;
    });
    if (valid) {
        return { embeds: [createEmbed(appName, channelName, invite)] };
    } else {
        return await createInvite(channelId, applicationId, guildId, datos);
    }
}


/** Crea un embed con la invitación. */
function createEmbed(app_name, channel_name, invite_link) {
    let embed = new EmbedBuilder()
        .setTitle(`${app_name} en ${channel_name}`)
        .setURL(invite_link)
        .setColor('#fc0303')
    return embed;
}


export { getActivity };