import dotenv from 'dotenv';
dotenv.config();
import playwright from 'playwright';
import Parser from 'rss-parser';
let parser = new Parser();
import { getDatabase, setDatabase } from './database.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';


/** Recolecta las ofertas del feed RSS y las envia por DM con botón de confirmar/cancelar.
 * Las ofertas serán nuevas si no están en la db. */
async function sendRSS(client) {
    let feed = await parser.parseURL('https://steamcommunity.com/groups/GrabFreeGames/rss/');
    let nombres = await getDatabase('freeGames');
    let tempGames = await getDatabase('tempGames');
    Object.keys(tempGames).forEach(val => { nombres.push(tempGames[val].titulo) });
    for (let item of feed.items) {
        if (!nombres.includes(item.title)) {
            nombres.push(item.title); // Por si hay alguna oferta duplicada
            let links = item.content.split('href="');
            links.shift();
            let gameLinks = [];
            for (let link of links) {
                if (link.includes('discord.gg')) break;
                link = link.split('"')[0];
                link = link.replace('https://steamcommunity.com/linkfilter/?url=', '');
                link = link.replace('store.epicgames.com/GRABFREEGAMES/', 'www.epicgames.com/store/es-ES/p/');
                link = link.replace('?epic_affiliate=GRABFREEGAMES', '');
                link = link.replace('https://www.epicgames.com/store/en-US/p/', 'https://www.epicgames.com/store/es-ES/p/');
                link = link.replace('https://store.epicgames.com/en-US/p/', 'https://store.epicgames.com/es-ES/p/');
                gameLinks.push(link);
            }
            let mensaje = '**Nueva Oferta**\n' + item.title + '\n' + gameLinks.join('\n');
            mensaje = mensaje.substring(0, 2000); // Discord's max message length
            askConfirm(mensaje, item.title, client);
            await sleep(1000); // Para que no se solape la db
        }
    }
    try {
        await getPrimeGames(client);
    } catch (error) {
        console.log(error);
    }
}


/** Recoge todos los juegos gratis de Prime Gaming. */
async function getPrimeGames(client) {
    const url = 'https://gaming.amazon.com/home';
    const browser = await playwright.firefox.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector('.offer-filters__button:nth-child(3) > .tw-interactive > .tw-pd-x-1 > .tw-pd-x-05 > .offer-filters__button__title')
    await page.click('.offer-filters__button:nth-child(3) > .tw-interactive > .tw-pd-x-1 > .tw-pd-x-05 > .offer-filters__button__title')
    const eval_div = '//*[@id="root"]/div/div/main/div/div/div/div[3]/div[5]/div/div/div[2]/div'
    const games = await page.$eval(eval_div,
        navElm => {
            let games_list = [];
            let titles = navElm.getElementsByTagName('h3');
            for (let item of titles) { games_list.push(item.innerText); }
            return games_list;
        });
    await browser.close();
    let titulo = games.join('; ');
    let mensaje = (`**Juegos Gratis de Prime Gaming** ${url} \n`);
    let n = 1;
    let new_prime = true;
    for (let name of games) { mensaje += `${n}. ${name}\n`; n++; if (name.toLowerCase().includes('prime gaming bundle')) new_prime = false; };
    let nombres = await getDatabase('freeGames');
    let tempGames = await getDatabase('tempGames');
    Object.keys(tempGames).forEach(val => { nombres.push(tempGames[val].titulo) });
    if (!nombres.includes(titulo) && new_prime) askConfirm(mensaje.substring(0, 2000), titulo, client, true);
}


/** Envía el mensaje con botón de confirmar/cancelar el envio de la oferta. */
async function askConfirm(mensaje, titulo, client, prime = false) {
    const row = new ActionRowBuilder()
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('confirm')
            .setLabel('confirm')
            .setStyle(ButtonStyle.Success));
    row.addComponents(
        new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('cancel')
            .setStyle(ButtonStyle.Danger));
    let sent_message;;
    const admin_id = await client.users.fetch(process.env.BOT_ADMIN);
    await admin_id.send({ content: mensaje, components: [row], fetchReply: true }).then(msg => sent_message = msg);
    const msgid = sent_message.id.toString();
    let tempGames = await getDatabase('tempGames');
    tempGames[msgid] = { mensaje, titulo };
    setDatabase('tempGames', tempGames);
    let extra_minutes = 0;
    if (prime) extra_minutes = 24 * 60; // 24h
    await sleep(1000 * 60 * (Number(process.env.MINUTES_BEFORE_AUTOSEND_FREE_GAME) + extra_minutes)); // Espera x minutos antes de enviar el juego automáticamente
    let tempGames2 = await getDatabase('tempGames');
    if (tempGames2[msgid]) {
        let rssChannels = await getDatabase('rss');
        for (const channel of rssChannels) {
            try {
                client.channels.cache.get(channel).send({ content: tempGames2[msgid].mensaje });
            } catch (error) {
                console.log('RSS - Error sending message to: ' + channel);
            }
        }
        sent_message.edit({ content: tempGames2[msgid].titulo + '\n**Oferta Enviada Automáticamente**', components: [] });
        let nombres = await getDatabase('freeGames');
        nombres.push(tempGames2[msgid].titulo);
        setDatabase('freeGames', nombres);
        delete tempGames2[msgid];
        setDatabase('tempGames', tempGames2);
    }
}


/** Si se ha pulsado el botón de confirmar, se envía la oferta. Si se pulsa cancelar, no. */
async function confirmGame(interaction, client) {
    let tempGames = await getDatabase('tempGames');
    if (!tempGames[interaction.message.id]) return;
    if (interaction.customId == 'confirm') {
        let rssChannels = await getDatabase('rss');
        for (const channel of rssChannels) {
            try { client.channels.cache.get(channel).send({ content: tempGames[interaction.message.id].mensaje }); } catch (error) { console.log(error); }
        }
        interaction.editReply({ content: tempGames[interaction.message.id].titulo + '\n**Oferta Confirmada**', components: [] });
    } else {
        interaction.editReply({ content: tempGames[interaction.message.id].titulo + '\n**Oferta Cancelada**', components: [] });
    }
    let nombres = await getDatabase('freeGames');
    nombres.push(tempGames[interaction.message.id].titulo);
    setDatabase('freeGames', nombres);
    delete tempGames[interaction.message.id];
    setDatabase('tempGames', tempGames);
}


/** Espera x ms a seguir. */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }


/** Establece o elimina el canal donde tiene que enviar los mensajes y lo guarda en la db. */
async function setRSSchannel(interaction, activo) {
    if (activo == 'establecer') {
        let rssChannels = await getDatabase('rss');
        if (rssChannels.indexOf(interaction.channel.id) !== -1) {
            await interaction.reply({ content: 'El canal ya estaba establecido.\n`/ofertas quitar` para dejar de recibir las ofertas.' });
        } else {
            rssChannels.push(interaction.channel.id)
            setDatabase('rss', rssChannels);
            await interaction.reply({ content: 'Canal establecido.\n`/ofertas quitar` para dejar de recibir las ofertas.' });
        }
    } else {
        let rssChannels = await getDatabase('rss');
        const index = rssChannels.indexOf(interaction.channel.id);
        if (index > -1) {
            rssChannels.splice(index, 1);
            setDatabase('rss', rssChannels);
            await interaction.reply({ content: 'Este canal ya no recibirá ofertas.\n`/ofertas establecer` para volver a recibirlas.' });
        } else {
            await interaction.reply({ content: 'El canal NO recibía ofertas.\n`/ofertas establecer` para recibirlas.' });
        }
    }
};


export { sendRSS, setRSSchannel, confirmGame };