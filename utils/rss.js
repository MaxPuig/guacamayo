let Parser = require('rss-parser');
let parser = new Parser();
const fs = require('fs');
let rssChannels = [];

//Cada 15 mins, si hay una oferta nueva la envía
async function sendRSS(client) {
    rssChannels = JSON.parse(fs.readFileSync('./data/rss.json', 'utf-8'));
    try {
        if (rssChannels.length > 0) {
            let oferta = await freeFames();
            if (oferta.length > 0) {
                for (const channel in rssChannels) {
                    client.channels.cache.get(rssChannels[channel]).send(oferta);
                }
            }
        }
    } catch (error) { }
};


//Establece el canal donde tiene que enviar los mensajes
function setRSSchannel(msg, prefix) {
    if (msg.content == `${prefix}rss` && msg.member.permissions.has("ADMINISTRATOR")) {
        rssChannels = JSON.parse(fs.readFileSync('./data/rss.json', 'utf-8'));
        rssChannels.push(msg.channel.id)
        fs.writeFileSync('./data/rss.json', JSON.stringify(rssChannels));
        msg.channel.send('Canal establecido. `' + prefix + 'rss borrar` Para dejar de enviar las ofertas.');
    }
};


function deleteRSSchannel(msg, prefix) {
    if (msg.content == `${prefix}rss borrar` && msg.member.permissions.has("ADMINISTRATOR")) {
        rssChannels = JSON.parse(fs.readFileSync('./data/rss.json', 'utf-8'));
        const index = rssChannels.indexOf(msg.channel.id);
        if (index > -1) { rssChannels.splice(index, 1); }
        fs.writeFileSync('./data/rss.json', JSON.stringify(rssChannels));
        msg.channel.send('Este canal ya no recibirá ofertas. \n`' + prefix + 'rss` para volver a recibirlas. (Solo admin)');
    }
};


//Crea un string con las nuevas ofertas
async function freeFames() {
    let feed = await parser.parseURL('https://steamcommunity.com/groups/GrabFreeGames/rss/');
    let nombres, link;
    let nombresNuevos = [];
    let mensaje = '';
    try {
        nombres = JSON.parse(fs.readFileSync('./data/freeGames.json', 'utf-8'));
    } catch (error) {
        nombres = [];
    }
    feed.items.forEach(item => {
        nombresNuevos.push(item.title);
        if (!nombres.includes(item.title)) {
            if (!mensaje.startsWith('**Nueva Oferta**')) {
                mensaje += '**Nueva Oferta**\n';
            }
            link = item.content;
            link = link.split('href=\"');
            link = link[1].split('"');
            link = link[0];
            if (link.startsWith('https://steamcommunity.com/linkfilter/?url=')) {
                link = link.split('https://steamcommunity.com/linkfilter/?url=')[1];
            }
            if (link.startsWith('https://store.epicgames.com/GRABFREEGAMES')) {
                link = link.replace('epicgames.com/GRABFREEGAMES/', 'epicgames.com/store/');
            }
            mensaje += item.title + '\n' + link + '\n\n';
        }
    });
    fs.writeFileSync('./data/freeGames.json', JSON.stringify(nombresNuevos));
    return mensaje;
};



module.exports = { sendRSS, setRSSchannel, deleteRSSchannel };