import dotenv from 'dotenv';
dotenv.config();
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { writeFileSync, mkdirSync, createReadStream } from 'fs';
import { getDatabase, setDatabase } from './database.js';
const client = new TextToSpeechClient({ projectId: 'tts-nodejs-discord', keyFilename: process.env.PATHGOOGLE, });
import { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, } from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter.js';
import { MessageEmbed } from 'discord.js';
import gTTS from 'gtts';



/** Activa o desactiva la función de avisar por el canal de voz quién se ha unido.
* Tambien puede cambiar las propiedades de la voz o enviar info de como cambiarlas. */
async function change_voice_properties(msg, prefix) {
    if (msg.content.toLowerCase() == `${prefix}voz desactivar` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = await getDatabase('nombresAudio');
        if (datos[msg.channel.guild.id] != undefined) {
            datos[msg.channel.guild.id]["disabled"] = true;
            msg.channel.send('Avisos de voz desactivados. `' + prefix + 'voz activar` para deshacer.');
        } else {
            datos[msg.channel.guild.id] = { "disabled": true };
            msg.channel.send('Avisos de voz desactivados. `' + prefix + 'voz activar` para deshacer.');
        }
        setDatabase('nombresAudio', datos);
    } else if (msg.content.toLowerCase() == `${prefix}voz activar` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = await getDatabase('nombresAudio');
        if (datos[msg.channel.guild.id] != undefined) {
            datos[msg.channel.guild.id]["disabled"] = false;
            msg.channel.send('Avisos de voz activados. `' + prefix + 'voz desactivar` para deshacer.');
        } else {
            datos[msg.channel.guild.id] = { "disabled": false };
            msg.channel.send('Avisos de voz activados. `' + prefix + 'voz desactivar` para deshacer.');
        }
        setDatabase('nombresAudio', datos);
    } else if (msg.content.toLowerCase() == `${prefix}voz chica` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = await getDatabase('nombresAudio');
        if (datos[msg.channel.guild.id].genero == 'chico') {
            let nuevosdatos = { // Borra todo para volver a descargar todos los audios.
                "genero": "chica",
                "delante_o_detras": datos[msg.channel.guild.id].delante_o_detras,
                "disabled": datos[msg.channel.guild.id].disabled,
                "frase": datos[msg.channel.guild.id].frase,
                "idioma": datos[msg.channel.guild.id].idioma,
            };
            datos[msg.channel.guild.id] = nuevosdatos;
            msg.channel.send('Género de voz cambiado a chica.');
            setDatabase('nombresAudio', datos);
        } else {
            msg.channel.send('Género de voz ya es chica.');
        }
    } else if (msg.content.toLowerCase() == `${prefix}voz chico` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = await getDatabase('nombresAudio');
        if (datos[msg.channel.guild.id].genero == 'chica') {
            let nuevosdatos = {
                "genero": "chico",
                "delante_o_detras": datos[msg.channel.guild.id].delante_o_detras,
                "disabled": datos[msg.channel.guild.id].disabled,
                "frase": datos[msg.channel.guild.id].frase,
                "idioma": datos[msg.channel.guild.id].idioma,
            };
            datos[msg.channel.guild.id] = nuevosdatos;
            msg.channel.send('Género de voz cambiado a chico.');
            setDatabase('nombresAudio', datos);
        } else {
            msg.channel.send('Género de voz ya es chico.');
        }
    } else if (msg.content.toLowerCase().startsWith(`${prefix}voz idioma `) && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = await getDatabase('nombresAudio');
        const availabla_lang = [
            'af', 'sq', 'ar', 'hy', 'ca', 'zh', 'zh-cn', 'zh-tw', 'zh-yue', 'hr', 'cs', 'da', 'nl', 'en', 'en-au', 'en-uk',
            'en-us', 'eo', 'fi', 'fr', 'de', 'el', 'ht', 'hi', 'hu', 'is', 'id', 'it', 'ja', 'ko', 'la', 'lv', 'mk', 'no',
            'pl', 'pt', 'pt-br', 'ro', 'ru', 'sr', 'sk', 'es', 'es-es', 'es-us', 'sw', 'sv', 'ta', 'th', 'tr', 'vi', 'cy'
        ]
        let requested_lang = msg.content.toLowerCase().split(' ')[2];
        if (['es', 'es-es', 'es-us'].includes(requested_lang)) { requested_lang = 'es-es'; }
        if (availabla_lang.includes(requested_lang) && requested_lang != datos[msg.channel.guild.id].idioma) {
            let nuevosdatos = {
                "genero": 'chica',
                "delante_o_detras": datos[msg.channel.guild.id].delante_o_detras,
                "disabled": datos[msg.channel.guild.id].disabled,
                "frase": datos[msg.channel.guild.id].frase,
                "idioma": requested_lang,
            };
            datos[msg.channel.guild.id] = nuevosdatos;
            msg.channel.send('Idioma cambiado');
            setDatabase('nombresAudio', datos);
        } else if (requested_lang == datos[msg.channel.guild.id].genero) {
            msg.channel.send('El idioma ya es este.');
        } else {
            msg.channel.send('Idioma no es correcto.');
        }
    } else if (msg.content.toLowerCase() == `${prefix}voz`) {
        let embed = new MessageEmbed()
            .setTitle('**Ajustes de Voz [Solo admin]: **')
            .setColor('#4166c5')
            .addFields(
                { name: '`' + prefix + 'voz <activar/desactivar>`', value: 'Activa o desactiva los avisos en el canal de voz.\nEjemplo: `' + prefix + 'voz desactivar`.' },
                { name: '`' + prefix + 'voz <chico/chica>`', value: 'Cambia la voz. Chico solo puede ser en Español.' },
                { name: '`' + prefix + 'voz idioma <Idioma_nuevo>`', value: 'Lista de idiomas (2 o 4 letras): <https://www.npmjs.com/package/gtts#supported-languages>.\nEjemplo: `' + prefix + 'voz idioma pt` para portugués.' },
                { name: 'Cambiar la frase', value: 'Próximamente' }
            )
        msg.channel.send({ embeds: [embed] });
    }
}


/** Descarga de la API de Google el audio (.mp3). */
async function descargar_audio_google(displayName, userID, guildID, datos) {
    let delante_o_detras = datos[guildID].delante_o_detras;
    let frase = datos[guildID].frase;
    if (delante_o_detras == 'delante') {
        frase = `${displayName} ${frase}`;
    } else {
        frase = `${frase} ${displayName}`;
    }
    const request = {
        input: { text: frase },
        voice: { languageCode: 'es-ES', name: 'es-ES-Wavenet-B' },
        audioConfig: { audioEncoding: 'MP3', effectsProfileId: ['headphone-class-device'], pitch: -5, speakingRate: 1 }
    };
    const [response] = await client.synthesizeSpeech(request);
    let targetDir = `./data/audioNombres/${guildID}`;
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(targetDir + `/${userID}.mp3`, response.audioContent, 'binary');
    console.log(`${displayName} - Audio content written to file: ${guildID}/${userID}.mp3`);

    datos[guildID][userID] = [displayName, Math.floor(Date.now() / 1000)];
    return datos;
}


/** Descarga de gtts el audio (.mp3). */
async function descargar_audio_gtts(displayName, userID, guildID, datos) {
    let idioma = datos[guildID].idioma;
    let delante_o_detras = datos[guildID].delante_o_detras;
    let frase = datos[guildID].frase;
    if (delante_o_detras == 'delante') {
        frase = `${displayName} ${frase}`;
    } else {
        frase = `${frase} ${displayName}`;
    }
    const gtts = new gTTS(frase, idioma);
    let path = `./data/audioNombres/${guildID}`;
    mkdirSync(path, { recursive: true });
    await new Promise(resolve => {
        gtts.save(path + `/${userID}.mp3`, function (err, response) {
            if (err) { throw new Error(err) }
            console.log(`${displayName} - Audio content written to file: ${guildID}/${userID}.mp3`);
            resolve(response)
        });
    });

    datos[guildID][userID] = [displayName, Math.floor(Date.now() / 1000)];
    return datos;
}


/** Si se ha unido alguien a un canal de voz, reproduce el audio.
 * Debe de haber alguien (no bot) en el canal y que el server no haya desactivado la funcionalidad (.voz desactivar) para reproducir el audio. */
async function userJoined(oldState, newState) {
    if (oldState.channelId != newState.channelId && (newState.channelId != null || newState.channelId != undefined) && !newState.member.user.bot) {
        let usersInChannel = 0;
        newState.channel.members.forEach(usuario => {
            if (!usuario.user.bot) {
                usersInChannel++;
            }
        });
        if (usersInChannel > 1) {
            let datos = await getDatabase('nombresAudio');
            const guildID = newState.channel.guild.id;
            if (datos[guildID] != undefined) {
                if (datos[guildID]["disabled"] == true) {
                    return;
                } else {
                    playAudio(newState, datos);
                }
            } else {
                datos[guildID] = {
                    "disabled": false,
                    "delante_o_detras": "detras",
                    "frase": "Se ha unido",
                    "idioma": "es-es",
                    "genero": "chico"
                }
                playAudio(newState, datos);
            }
        }
    }
}


/** Si el no existe el audio o el usuario ha cambiado de nombre, descargará el audio.
 * Deben de pasar al menos 10 segundos para que se reprodzca el audio. */
async function playAudio(newState, datos) {
    let voiceChannel = newState.channel;
    let currentDisplayName = newState.member.displayName;
    let currentTime = Math.floor(Date.now() / 1000);
    let displayName, lastTime;
    let userID = newState.member.user.id;
    let guildID = newState.channel.guild.id;
    try {
        displayName = datos[guildID][userID][0];
        lastTime = datos[guildID][userID][1];
    } catch {
        lastTime = 0;
    }
    if (displayName != currentDisplayName) { // Si el nombre NO es el mismo que el del audio
        if (datos[guildID].genero == 'chico') {
            datos = await descargar_audio_google(currentDisplayName, userID, guildID, datos);
        } else {
            datos = await descargar_audio_gtts(currentDisplayName, userID, guildID, datos);
        }
    }
    if (currentTime - lastTime > 9) { // Si han pasado más de 10 secs de la última vez que se ha reproducido
        datos[guildID][userID][1] = Math.floor(Date.now() / 1000);
        setDatabase('nombresAudio', datos);
        const player = createAudioPlayer();
        const resource = createAudioResource(createReadStream(`./data/audioNombres/${guildID}/${userID}.mp3`), { inputType: StreamType.Arbitrary, });
        player.play(resource);
        try {
            const connection = await connectToChannel(voiceChannel);
            connection.subscribe(player);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
            })
        } catch (error) {
            console.error(error);
        }
    }
}


/** Crea una conexión con el canal de voz. */
async function connectToChannel(channel) { // message.member.voice.channel
    const connection = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: createDiscordJSAdapter(channel), });
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}


export { userJoined, change_voice_properties };