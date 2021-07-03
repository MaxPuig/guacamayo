const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
require('dotenv').config();
const client = new textToSpeech.TextToSpeechClient({ projectId: 'tts-nodejs-discord', keyFilename: process.env.PATHGOOGLE, });
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, StreamType, AudioPlayerStatus, VoiceConnectionStatus, } = require('@discordjs/voice');
const { createDiscordJSAdapter } = require('./adapter');
const { createReadStream } = require('fs');


function disable_enable_voice(msg, prefix) {
    if (msg.content == `${prefix}voice disable` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = JSON.parse(fs.readFileSync('./data/nombresAudio.json', 'utf-8'));
        if (datos[msg.channel.guild.id] != undefined) {
            datos[msg.channel.guild.id]["disabled"] = true;
            msg.channel.send('Avisos de voz desactivados. `' + prefix + 'voice enable` para deshacer.');
        } else {
            datos[msg.channel.guild.id] = { "disabled": true };
            msg.channel.send('Avisos de voz desactivados. `' + prefix + 'voice enable` para deshacer.');
        }
        fs.writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
    } else if (msg.content == `${prefix}voice enable` && msg.member.permissions.has("ADMINISTRATOR")) {
        let datos = JSON.parse(fs.readFileSync('./data/nombresAudio.json', 'utf-8'));
        if (datos[msg.channel.guild.id] != undefined) {
            datos[msg.channel.guild.id]["disabled"] = false;
            msg.channel.send('Avisos de voz activados. `' + prefix + 'voice disable` para deshacer.');
        } else {
            datos[msg.channel.guild.id] = { "disabled": false };
            msg.channel.send('Avisos de voz activados. `' + prefix + 'voice disable` para deshacer.');
        }
        fs.writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
    }
}


// Descarga el audio desde Google
async function descargar_audio(displayName, userID, guildID, datos) {
    const text = 'Se ha unido ' + displayName;
    const request = {
        input: { text: text },
        voice: { languageCode: 'es-ES', name: 'es-ES-Wavenet-B' },
        audioConfig: { audioEncoding: 'MP3', effectsProfileId: ['headphone-class-device'], pitch: -5, speakingRate: 1 }
    };
    const [response] = await client.synthesizeSpeech(request);
    let targetDir = `./data/audioNombres/${guildID}`;
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetDir + `/${userID}.mp3`, response.audioContent, 'binary');
    console.log(displayName + ` - Audio content written to file: ${guildID}/${userID}.mp3`);

    if (datos[guildID] == undefined) { datos[guildID] = {}; };
    datos[guildID][userID] = [displayName, Math.floor(Date.now() / 1000)];
    fs.writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
}


//Si se ha unido alguien a un canal de voz (y no se ha desconectado) y no es un bot
function userJoined(oldMember, newMember) {
    if (oldMember.channelID != newMember.channelID && (newMember.channelID != null || newMember.channelID != undefined) && !newMember.member.user.bot) {
        let usersInChannel = 0;
        newMember.channel.members.forEach(usuario => {
            if (!usuario.user.bot) {
                usersInChannel++;
            }
        });
        if (usersInChannel > 1) {
            let datos = JSON.parse(fs.readFileSync('./data/nombresAudio.json', 'utf-8'));
            if (datos[newMember.channel.guild.id] != undefined) {
                if (datos[newMember.channel.guild.id]["disabled"] == true) {
                    return;
                } else {
                    playAudio(newMember, datos);
                }
            } else {
                playAudio(newMember, datos);
            }
        }
    }
}


async function playAudio(new_Member, datos) {
    let voiceChannel = new_Member.channel;
    let currentDisplayName = new_Member.member.displayName;
    let currentTime = Math.floor(Date.now() / 1000);
    let displayName, lastTime;
    let userID = new_Member.member.user.id;
    let guildID = new_Member.channel.guild.id;
    try {
        displayName = datos[guildID][userID][0];
        lastTime = datos[guildID][userID][1];
    } catch {
        lastTime = 0;
    }
    if (displayName != currentDisplayName) { // Si el nombre NO es el mismo que el del audio
        await descargar_audio(currentDisplayName, userID, guildID, datos);
    }
    if (currentTime - lastTime > 9) { // 9 Si han pasado más de 10 secs de la última vez que se ha reproducido
        datos[guildID][userID][1] = Math.floor(Date.now() / 1000);
        fs.writeFileSync('./data/nombresAudio.json', JSON.stringify(datos));
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



module.exports = { userJoined, disable_enable_voice };