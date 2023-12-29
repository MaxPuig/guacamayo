import dotenv from "dotenv";
dotenv.config();
import { setRSSchannel, askConfirm } from "./rss.js";
import { getActivity } from "./activities.js";
import { getDatabase, setDatabase } from "./database.js";
import { sendHelpCommands, sendInvite } from "./help.js";
import { addDeleteUserPermission } from "./adminPerms.js";
import { ChannelType, PermissionsBitField } from "discord.js";
import { avisos, espanol, idioma, frase, downloadCustomAudio, allowCustomAudio } from "./voice_settings.js";

/** Recibe los slash-commands y ejecuta lo que corresponde. */
async function slash_command(interaction, client) {
    if (interaction.commandName == "help") {
        interaction.reply(sendHelpCommands());
        return;
    } else if (interaction.commandName == "invite") {
        interaction.reply(sendInvite());
        return;
    } else if (interaction.commandName == "feedback") {
        const admin_id = await client.users.fetch(process.env.BOT_ADMIN);
        admin_id.send({ content: "<@!" + interaction.member.id + ">: " + interaction.options.getString("mensaje") });
        interaction.reply({ content: "Se ha enviado tu mensaje!\n> " + interaction.options.getString("mensaje") });
        return;
    } else if (interaction.commandName == "activity") {
        const canal = interaction.options.getChannel("canal");
        const actividad = interaction.options.getString("actividad");
        if (canal.type == ChannelType.GuildVoice) {
            interaction.reply(await getActivity(canal.id, actividad, interaction.guild.id, client));
            return;
        } else {
            interaction.reply({ content: "El canal debe ser un canal de voz.", ephemeral: true });
            return;
        }
    } else if (interaction.commandName == "voz") {
        if (interaction.options._subcommand == "audio_personalizado") {
            downloadCustomAudio(interaction);
            return;
        }
    } else if (interaction.commandName == "enviar_oferta") {
        if (interaction.member.id != process.env.BOT_ADMIN) {
            interaction.reply({ content: "Solo el creador del bot puede ejecutar el comando.", ephemeral: true });
            return;
        }
        const title = interaction.options.getString("titulo");
        const link = interaction.options.getString("link");
        let mensaje = "**Nueva Oferta**\n" + title + "\n" + link.replace(/ /g, "\n");
        askConfirm(mensaje.substring(0, 2000), title, client);
        let confirmation = "Oferta recibida para enviar!\n" + mensaje;
        interaction.reply({ content: confirmation.substring(0, 2000), ephemeral: false });
        return;
    }
    let datos = await getDatabase("adminPerms");
    datos = datos[interaction.guild.id];
    if (datos == undefined) datos = [];
    if (
        !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
        !datos.includes(interaction.user.id) &&
        interaction.member.id != process.env.BOT_ADMIN
    ) {
        let mensaje = "Solo la gente con rol/permiso de administrador puede usar este comando.\n";
        mensaje += "`/help` Para ver lo que puedes usar.";
        interaction.reply({ content: mensaje, ephemeral: true });
    } else if (interaction.commandName == "ofertas") {
        const activo = interaction.options.getString("establecer_o_quitar");
        setRSSchannel(interaction, activo);
    } else if (interaction.commandName == "voz") {
        voice_slash_command(interaction);
    } else if (interaction.commandName == "dar_permisos_bot") {
        if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) || interaction.member.id == process.env.BOT_ADMIN) {
            const userId = interaction.options.getUser("usuario").id;
            const addDelete = interaction.options.getString("dar_o_quitar");
            addDeleteUserPermission(interaction, addDelete, userId);
        } else {
            interaction.reply({ content: "No puedes dar permisos. Solo un administrador puede.", ephemeral: true });
        }
    }
}

/** Responde a los slash-commands relacionados con la voz. */
async function voice_slash_command(interaction) {
    let datos = await getDatabase("nombresAudio");
    if (datos[interaction.guild.id] == undefined) {
        datos[interaction.guild.id] = {
            disabled: false,
            delante_o_detras: "detras",
            frase: "Se ha unido",
            idioma: "es-es",
            genero: "hombre",
            custom_audio: true,
        };
        await setDatabase("nombresAudio", datos);
    }
    if (interaction.options._subcommand == "avisos") {
        const voz_activa = interaction.options.getString("activar_o_desactivar");
        avisos(interaction, voz_activa);
    } else if (interaction.options._subcommand == "español") {
        const genero = interaction.options.getString("género");
        espanol(interaction, genero);
    } else if (interaction.options._subcommand == "idioma") {
        const idioma_nuevo = interaction.options.getString("idioma_nuevo");
        const idioma_nuevo_2 = interaction.options.getString("idioma_nuevo_2");
        idioma(interaction, idioma_nuevo, idioma_nuevo_2);
    } else if (interaction.options._subcommand == "frase") {
        const posicion_nombre = interaction.options.getString("posición_nombre");
        const frase_nueva = interaction.options.getString("frase_nueva");
        frase(interaction, posicion_nombre, frase_nueva);
    } else if (interaction.options._subcommand == "permitir_audio_personalizado") {
        const permitir_o_no = interaction.options.getString("si_o_no");
        allowCustomAudio(interaction, permitir_o_no);
    }
}

export { slash_command };
