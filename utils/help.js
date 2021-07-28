import dotenv from 'dotenv';
dotenv.config();
import { MessageEmbed } from 'discord.js';


/** Envia por el canal de texto los comandos y como usarlos. */
function sendHelpCommands(msg, prefix) {
    if (msg.content.toLowerCase() == `${prefix}help`) {
        let embed = new MessageEmbed()
            .setTitle('**Comandos:**')
            .setColor('#4166c5')
            .addFields(
                { name: '`' + prefix + 'xgame` <Opcional: Tamaño>', value: 'Juego. Sin especificar tamaño para dimensiones aleatorias o `' + prefix + 'xgame 4x5` para tamaño personalizado (mínimo: 3x3, máximo: 5x5)' },
                { name: '`' + prefix + 'lista` <Opcional: Nombre de lista>', value: 'Empezar una lista de nombres. Hay que pulsar un botón para unirse.' },
                { name: '`' + prefix + 'voz` [Solo Admin]', value: 'Info sobre los ajustes de los avisos de voz.' },
                { name: '`' + prefix + 'rss` [Solo Admin]', value: 'Establecer ese canal de texto para recibir ofertas de juegos gratis. `' + prefix + 'rss borrar` para deshacerlo.' },
                { name: '`' + prefix + 'prefijo` <nuevo prefijo> [Solo Admin]', value: 'Cambiar el prefijo de los comandos. Ejemplo `.prefijo !`.' },
                // { name: '`' + prefix + 'relay` [Solo Admin]', value: 'Info sobre como mandar mensajes entre servidores.' },
                { name: `**Link de Invitación**`, value: '<' + process.env.INVITELINK + '>' }
            )
        // - Prefijo // - Voice // - RSS // - Lista // - Relay mensajes // - Xgame // - Invitación // Tests coche // TTT C4
        msg.channel.send({ embeds: [embed] });
    }
}


export { sendHelpCommands };