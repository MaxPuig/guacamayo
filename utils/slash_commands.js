import dotenv from 'dotenv';
dotenv.config();
import { sendHelpCommands, sendInvite } from './help.js';
import { startList } from './lists.js';
import { setRSSchannel } from './rss.js';
import { xgame_start } from './xgame.js';
import { avisos, default_settings, espanol, idioma, frase } from './voice_settings.js';

// msg.member.permissions.has("ADMINISTRATOR") 


/** Recibe los slash-commands y ejecuta lo que corresponde. */
async function slash_command(interaction) {
    if (interaction.commandName == 'help') {
        interaction.reply(sendHelpCommands());
    } else if (interaction.commandName == 'invite') {
        interaction.reply(sendInvite());
    } else if (interaction.commandName == 'lista') {
        const nombre_lista = interaction.options.getString('nombre_lista');
        startList(interaction, nombre_lista);
    } else if (interaction.commandName == 'xgame') {
        const tamano_x = interaction.options.getInteger('tamaño_x');
        const tamano_y = interaction.options.getInteger('tamaño_y');
        xgame_start(interaction, tamano_x, tamano_y);
    } else if (!interaction.member.permissions.has("ADMINISTRATOR")) {
        interaction.reply({
            content: 'Solo la gente con rol/permiso de administrador puede usar este comando.\n`/help` Para ver lo que puedes usar.', ephemeral: true
        });
        return;
    } else if (interaction.commandName == 'rss') {
        const activo = interaction.options.getString('establecer_o_quitar');
        setRSSchannel(interaction, activo);
    } else if (interaction.commandName == 'voz') {
        voice_slash_command(interaction);
    }
}


/** Responde a los slash commands de la voz. */
async function voice_slash_command(interaction) {
    if (interaction.commandName == 'voz') {
        if (interaction.options._subCommand == 'avisos') {
            const voz_activa = interaction.options.getString('activar_o_desactivar');
            avisos(interaction, voz_activa);
        } else if (interaction.options._subCommand == 'dafault') {
            default_settings(interaction);
        } else if (interaction.options._subCommand == 'español') {
            const genero = interaction.options.getString('género');
            espanol(interaction, genero);
        } else if (interaction.options._subCommand == 'idioma') {
            const idioma_nuevo = interaction.options.getString('idioma_nuevo');
            const idioma_nuevo_2 = interaction.options.getString('idioma_nuevo_2');
            idioma(interaction, idioma_nuevo, idioma_nuevo_2);
        } else if (interaction.options._subCommand == 'frase') {
            const posicion_nombre = interaction.options.getString('posición_nombre');
            const frase_nueva = interaction.options.getString('frase_nueva');
            frase(interaction, posicion_nombre, frase_nueva);
        }
    }
}


export { slash_command };