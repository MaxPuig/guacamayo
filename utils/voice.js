import dotenv from "dotenv";
dotenv.config();
import gTTS from "gtts";
import { getDatabase, setDatabase } from "./database.js";
import { writeFileSync, mkdirSync, createReadStream } from "fs";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
const client = new TextToSpeechClient({ projectId: "tts-nodejs-discord", keyFilename: process.env.PATHGOOGLE });
import {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    entersState,
    StreamType,
    AudioPlayerStatus,
    VoiceConnectionStatus,
} from "@discordjs/voice";

/** Descarga de la API de Google el audio (.mp3). */
async function descargar_audio_google(displayName, userID, guildID, datos) {
    let delante_o_detras = datos[guildID].delante_o_detras;
    let frase = datos[guildID].frase;
    if (delante_o_detras == "delante") {
        frase = `${displayName} ${frase}`;
    } else {
        frase = `${frase} ${displayName}`;
    }
    const request = {
        input: { text: frase },
        voice: { languageCode: "es-ES", name: "es-ES-Wavenet-B" },
        audioConfig: { audioEncoding: "MP3", effectsProfileId: ["headphone-class-device"], pitch: -5, speakingRate: 1 },
    };
    const [response] = await client.synthesizeSpeech(request);
    let targetDir = `./data/audioNombres/${guildID}`;
    mkdirSync(targetDir, { recursive: true });
    writeFileSync(targetDir + `/${userID}.mp3`, response.audioContent, "binary");
    console.log(`${displayName} - Audio content written to file: ${guildID}/${userID}.mp3`);

    datos[guildID][userID] = [displayName, Math.floor(Date.now() / 1000)];
    return datos;
}

/** Descarga de gtts el audio (.mp3). */
async function descargar_audio_gtts(displayName, userID, guildID, datos) {
    let idioma = datos[guildID].idioma;
    let delante_o_detras = datos[guildID].delante_o_detras;
    let frase = datos[guildID].frase;
    if (delante_o_detras == "delante") {
        frase = `${displayName} ${frase}`;
    } else {
        frase = `${frase} ${displayName}`;
    }
    const gtts = new gTTS(frase, idioma);
    let path = `./data/audioNombres/${guildID}`;
    mkdirSync(path, { recursive: true });
    await new Promise((resolve) => {
        gtts.save(path + `/${userID}.mp3`, function (err, response) {
            if (err) {
                throw new Error(err);
            }
            console.log(`${displayName} - Audio content written to file: ${guildID}/${userID}.mp3`);
            resolve(response);
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
        newState.channel.members.forEach((usuario) => {
            if (!usuario.user.bot) usersInChannel++;
        });
        if (usersInChannel > 1) {
            const guildID = newState.channel.guild.id;
            let datos = await getDatabase("nombresAudio");
            if (!datos[guildID]) datos[guildID] = defaultAudioSettings;
            if (datos[guildID]["disabled"] == true) {
                return;
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
    let displayName, lastTime, customAudio;
    let userID = newState.member.user.id;
    let guildID = newState.channel.guild.id;
    if (datos[guildID].custom_audio == undefined) datos[guildID].custom_audio = true; // Feature added later on, so it's undefined for old servers.
    let custom_audio_allowed = datos[guildID].custom_audio;
    try {
        displayName = datos[guildID][userID][0];
        lastTime = datos[guildID][userID][1];
        customAudio = datos[guildID][userID][2];
    } catch {
        lastTime = 0;
    }
    // Si el nombre NO es el mismo que el del audio o tiene audio propio pero no está permitido.
    if ((displayName != currentDisplayName && !customAudio) || (customAudio && !custom_audio_allowed)) {
        if (datos[guildID].genero == "hombre") {
            datos = await descargar_audio_google(currentDisplayName, userID, guildID, datos);
        } else {
            datos = await descargar_audio_gtts(currentDisplayName, userID, guildID, datos);
        }
    }
    if (currentTime - lastTime > 9) {
        // Si han pasado más de 10 secs de la última vez que se ha reproducido
        datos[guildID][userID][1] = Math.floor(Date.now() / 1000);
        setDatabase("nombresAudio", datos);
        const player = createAudioPlayer();
        const resource = createAudioResource(createReadStream(`./data/audioNombres/${guildID}/${userID}.mp3`), { inputType: StreamType.Arbitrary });
        player.play(resource);
        try {
            const connection = await connectToChannel(voiceChannel);
            connection.subscribe(player);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.disconnect();
            });
        } catch (error) {
            console.error(error);
        }
    }
}

/** Crea una conexión con el canal de voz. */
async function connectToChannel(channel) {
    // message.member.voice.channel
    const connection = joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator });
    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30e3);
        return connection;
    } catch (error) {
        connection.destroy();
        throw error;
    }
}

const defaultAudioSettings = {
    disabled: false,
    delante_o_detras: "detras",
    frase: "Se ha unido",
    idioma: "es-es",
    genero: "hombre",
    custom_audio: true,
};

export { userJoined };
