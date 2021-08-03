import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';
const token = process.env.TOKEN.toString();


/** Devuelve un embed con una actividad para jugar en un canal de voz. */
async function getActivity(channelId, applicationId) {
    let error, embed;
    try {
        await fetch(`https://discord.com/api/v8/channels/${channelId}/invites`, {
            method: "POST",
            body: JSON.stringify({
                max_age: 86400,
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
                embed = new MessageEmbed()
                    .setTitle(`${invite.target_application.name} en ${invite.channel.name}`)
                    .setURL('https://discord.gg/' + invite.code)
                    .setColor('#fc0303')
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


export { getActivity };