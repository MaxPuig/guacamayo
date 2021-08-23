import Parser from 'rss-parser';
let parser = new Parser();
import { getDatabase, setDatabase } from './database.js';


/** Recoge las ofertas de juegos de un feed RSS y las envía a todos los canales de la db. */
async function sendRSS(client) {
    let rssChannels = await getDatabase('rss');
    try {
        if (rssChannels.length > 0) {
            let oferta = await freeGames();
            if (oferta.length > 0) {
                for (const channel in rssChannels) {
                    client.channels.cache.get(rssChannels[channel]).send(oferta);
                }
            }
        }
    } catch (error) { }
};


/** Establece o elimina el canal donde tiene que enviar los mensajes y lo guarda en "./data/rss.json". */
async function setRSSchannel(interaction, activo) {
    if (activo == 'establecer') {
        let rssChannels = await getDatabase('rss');
        if (rssChannels.indexOf(interaction.channel.id) !== -1) {
            await interaction.reply('El canal ya estaba establecido.\n`/ofertas quitar` para dejar de recibir las ofertas.');
        } else {
            rssChannels.push(interaction.channel.id)
            setDatabase('rss', rssChannels);
            await interaction.reply('Canal establecido.\n`/ofertas quitar` para dejar de recibir las ofertas.');
        }
    } else {
        let rssChannels = await getDatabase('rss');
        const index = rssChannels.indexOf(interaction.channel.id);
        if (index > -1) {
            rssChannels.splice(index, 1);
            setDatabase('rss', rssChannels);
            await interaction.reply('Este canal ya no recibirá ofertas.\n`/ofertas establecer` para volver a recibirlas.');
        } else {
            await interaction.reply('El canal NO recibía ofertas.\n`/ofertas establecer` para recibirlas.');
        }
    }
};


/** Recolecta las ofertas del feed RSS y devuelve un string con ellas.
 * Las ofertas serán nuevas la ofertas si no están en el array de './data/freeGames.json'. */
async function freeGames() {
    let feed = await parser.parseURL('https://steamcommunity.com/groups/GrabFreeGames/rss/');
    let nombres = await getDatabase('freeGames');
    let mensaje = '';
    let total = 0;
    feed.items.forEach(item => {
        if (!nombres.includes(item.title)) {
            total++;
            nombres.push(item.title);
            if (!mensaje.startsWith('**Nueva Oferta**')) {
                mensaje += '**Nueva Oferta**\n';
            }
            let links = item.content.split('href="');
            links.shift();
            let gameLinks = [];
            for (let link of links) {
                if (link.includes("discord.gg")) { break; }
                link = link.split('"')[0];
                link = link.replace('https://steamcommunity.com/linkfilter/?url=', '');
                link = link.replace('store.epicgames.com/GRABFREEGAMES/', 'www.epicgames.com/store/es-ES/p/');
                gameLinks.push(link);
            }
            mensaje += item.title + '\n' + gameLinks.join('\n') + '\n\n';
        }
    });
    setDatabase('freeGames', nombres);
    if (total == 10) { return ''; } // Ignora la primera vez que se ejecuta
    return mensaje.substring(0, 2000);
};


export { sendRSS, setRSSchannel };