require('dotenv').config();


/** Envia por el canal de texto los comandos y como usarlos. */
function sendHelpCommands(msg, prefix) {
    if (msg.content.toLowerCase() == `${prefix}help`) {
        let mensaje = '**Comandos:**\n';
        mensaje += '`' + prefix + 'prefijo <nuevo prefijo>` para cambiar el prefijo de los comandos. Ejemplo `.prefijo !` (Solo admin)\n';
        mensaje += '`' + prefix + 'voz <activar/desactivar>` para activar/desactivar los avisos en el canal de voz. Ejemplo `' + prefix + 'voz desactivar` (Solo admin)\n';
        mensaje += '`' + prefix + 'rss` para establecer ese canal de texto para recibir ofertas de juegos. `' + prefix + 'rss borrar` para deshacerlo. (Solo admin)\n';
        mensaje += '`' + prefix + 'lista` para empezar una lista de nombres. Hay que pulsar el botón para unirse.\n';
        // mensaje += '`' + prefix + 'relay` info sobre como mandar mensajes entre servidores. (Solo admin)\n';
        mensaje += '`' + prefix + 'xgame` (Juego) para dimensiones aleatorias o `' + prefix + 'xgame 4x5` para tamaño personalizado (mínimo: 3x3, máximo: 5x5)\n';
        mensaje += 'Link de invitación: <' + process.env.INVITELINK + '>';
        // - Prefijo
        // - Voice
        // - RSS admin
        // - Lista
        // - Relay mensaje
        // - Xgame
        // - Invitación 
        // Tests coche
        // TTT C4
        msg.channel.send(mensaje);
    }
}


module.exports = { sendHelpCommands };