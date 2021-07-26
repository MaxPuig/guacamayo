import dotenv from 'dotenv';
dotenv.config();
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { readFileSync, writeFileSync, mkdirSync, createReadStream } from 'fs';
const client = new TextToSpeechClient({ projectId: 'tts-nodejs-discord', keyFilename: process.env.PATHGOOGLE, });
import { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, } from '@discordjs/voice';
import { createDiscordJSAdapter } from './adapter.js';


/** Activa o desactiva la función de avisar por el canal de voz quién se ha unido.*/
function disable_enable_voice(msg, prefix) {
    if (msg.content.toLowerCase() == `${prefix}voz desactivar` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = JSON.parse(readFileSync('./data/nombresAudio.json', 'utf-8'));
        if (datos[msg.channel.guild.id] != undefined) {
            datos[msg.channel.guild.id]["disabled"] = true;
            msg.channel.send('Avisos de voz desactivados. `' + prefix + 'voz activar` para deshacer.');
        } else {
            datos[msg.channel.guild.id] = { "disabled": true };
            msg.channel.send('Avisos de voz desactivados. `' + prefix + 'voz activar` para deshacer.');
        }
        writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
    } else if (msg.content.toLowerCase() == `${prefix}voz activar` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = JSON.parse(readFileSync('./data/nombresAudio.json', 'utf-8'));
        if (datos[msg.channel.guild.id] != undefined) {
            datos[msg.channel.guild.id]["disabled"] = false;
            msg.channel.send('Avisos de voz activados. `' + prefix + 'voz desactivar` para deshacer.');
        } else {
            datos[msg.channel.guild.id] = { "disabled": false };
            msg.channel.send('Avisos de voz activados. `' + prefix + 'voz desactivar` para deshacer.');
        }
        writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
    }
}


/** Descarga de la API de Google el audio (.mp3). */
async function descargar_audio(displayName, userID, guildID, datos) {
    const text = 'Se ha unido ' + displayName;
    const request = {
        input: { text: text },
        voice: { languageCode: 'es-ES', name: 'es-ES-Wavenet-B' },
        audioConfig: { audioEncoding: 'MP3', effectsProfileId: ['headphone-class-device'], pitch: -5, speakingRate: 1 }
    };
    const [response] = await client.synthesizeSpeech(request);
    let targetDir = `./data/audioNombres/${guildID}`;
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(targetDir + `/${userID}.mp3`, response.audioContent, 'binary');
    console.log(displayName + ` - Audio content written to file: ${guildID}/${userID}.mp3`);

    if (datos[guildID] == undefined) { datos[guildID] = {}; };
    datos[guildID][userID] = [displayName, Math.floor(Date.now() / 1000)];
    writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
}


/** Si se ha unido alguien a un canal de voz, reproduce el audio.
 * Debe de haber alguien (no bot) en el canal y que el server no haya desactivado la funcionalidad (.voz desactivar) para reproducir el audio. */
function userJoined(oldState, newState) {
    if (oldState.channelId != newState.channelId && (newState.channelId != null || newState.channelId != undefined) && !newState.member.user.bot) {
        let usersInChannel = 0;
        newState.channel.members.forEach(usuario => {
            if (!usuario.user.bot) {
                usersInChannel++;
            }
        });
        if (usersInChannel > 1) {
            let datos = JSON.parse(readFileSync('./data/nombresAudio.json', 'utf-8'));
            if (datos[newState.channel.guild.id] != undefined) {
                if (datos[newState.channel.guild.id]["disabled"] == true) {
                    return;
                } else {
                    playAudio(newState, datos);
                }
            } else {
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
        await descargar_audio(currentDisplayName, userID, guildID, datos);
    }
    if (currentTime - lastTime > 9) { // Si han pasado más de 10 secs de la última vez que se ha reproducido
        datos[guildID][userID][1] = Math.floor(Date.now() / 1000);
        writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
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
};


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


export { userJoined, disable_enable_voice };