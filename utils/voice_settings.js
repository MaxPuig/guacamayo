import dotenv from 'dotenv';
dotenv.config();
import fetch from 'node-fetch';
import { fileSync } from 'tmp';
import ffmpeg from 'fluent-ffmpeg';
import { writeFileSync, mkdirSync, appendFile } from 'fs';
import { getDatabase, setDatabase } from './database.js';


/** Activa o desactiva los avisos en el canal de voz. */
async function avisos(interaction, voz_activa) {
    if (voz_activa == 'activar') {
        let datos = await getDatabase('nombresAudio');
        datos[interaction.guild.id]["disabled"] = false;
        interaction.reply({ content: 'Avisos de voz activados. `/voz avisos desactivar` para deshacer.' });
        setDatabase('nombresAudio', datos);
    } else {
        let datos = await getDatabase('nombresAudio');
        datos[interaction.guild.id]["disabled"] = true;
        interaction.reply({ content: 'Avisos de voz desactivados. `/voz avisos activar` para deshacer.' });
        setDatabase('nombresAudio', datos);
    }
}


/** Activa o desactiva los avisos en el canal de voz. */
async function espanol(interaction, genero) {
    if (genero == 'hombre') {
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id].genero == 'mujer') {
            let nuevosdatos = {
                "disabled": datos[interaction.guild.id].disabled,
                "delante_o_detras": datos[interaction.guild.id].delante_o_detras,
                "frase": datos[interaction.guild.id].frase,
                "idioma": 'es-es',
                "genero": 'hombre',
                "custom_audio": datos[interaction.guild.id].custom_audio
            };
            datos[interaction.guild.id] = nuevosdatos;
            interaction.reply({ content: 'Voz cambiada a español hombre.' });
            setDatabase('nombresAudio', datos);
        } else {
            interaction.reply({ content: 'La voz ya era español hombre.' });
        }
    } else {
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id].genero == 'hombre' || datos[interaction.guild.id].idioma != 'es-es') {
            let nuevosdatos = { // Borra todo para volver a descargar todos los audios.
                "disabled": datos[interaction.guild.id].disabled,
                "delante_o_detras": datos[interaction.guild.id].delante_o_detras,
                "frase": datos[interaction.guild.id].frase,
                "idioma": 'es-es',
                "genero": 'mujer',
                "custom_audio": datos[interaction.guild.id].custom_audio
            };
            datos[interaction.guild.id] = nuevosdatos;
            interaction.reply({ content: 'Voz cambiada a español mujer.' });
            setDatabase('nombresAudio', datos);
        } else {
            interaction.reply({ content: 'La voz ya era español mujer.' });
        }
    }
}


/** Cambia el idioma de la voz. */
async function idioma(interaction, idioma_nuevo, idioma_nuevo_2) {
    let idioma;
    if (idioma_nuevo == 'mas' && idioma_nuevo_2 == 'ignorar') {
        interaction.reply({ content: 'Has escogido mal el idioma. (Has escogido `más_idiomas` y `ya_he_escogido`).' });
        return;
    } else if (idioma_nuevo == 'mas' && idioma_nuevo_2 != 'ignorar') {
        idioma = idioma_nuevo_2;
    } else if (idioma_nuevo != 'mas' && idioma_nuevo_2 == 'ignorar') {
        idioma = idioma_nuevo;
    } else {
        interaction.reply({ content: 'Has escogido 2 idiomas. En el primer menú puedes seleccionar `más_idiomas`. En el segundo menú puedes seleccionar `ya_he_escogido`.' });
        return;
    }
    let datos = await getDatabase('nombresAudio');
    if (idioma != datos[interaction.guild.id].idioma) {
        let nuevosdatos = {
            "disabled": datos[interaction.guild.id].disabled,
            "delante_o_detras": datos[interaction.guild.id].delante_o_detras,
            "frase": datos[interaction.guild.id].frase,
            "idioma": idioma,
            "genero": 'mujer',
            "custom_audio": datos[interaction.guild.id].custom_audio
        };
        datos[interaction.guild.id] = nuevosdatos;
        interaction.reply({ content: `Idioma cambiado a ${idioma}.` });
        setDatabase('nombresAudio', datos);
    } else {
        interaction.reply({ content: 'El idioma ya es este.' });
    }
}


/** Cambia la frase que dice el bot. Deja escoger si el nombre va antes o después de la frase. */
async function frase(interaction, posicion_nombre, frase_nueva) {
    let datos = await getDatabase('nombresAudio');
    let nuevosdatos = {
        "disabled": datos[interaction.guild.id].disabled,
        "delante_o_detras": posicion_nombre,
        "frase": frase_nueva,
        "idioma": datos[interaction.guild.id].idioma,
        "genero": datos[interaction.guild.id].genero,
        "custom_audio": datos[interaction.guild.id].custom_audio
    };
    datos[interaction.guild.id] = nuevosdatos;
    if (posicion_nombre == 'delante') {
        interaction.reply({ content: `Ahora los audios serán así: ${interaction.member.displayName} ${nuevosdatos.frase}.` });
    } else {
        interaction.reply({ content: `Ahora los audios serán así: ${nuevosdatos.frase} ${interaction.member.displayName}.` });
    }
    setDatabase('nombresAudio', datos);
}


/** Descarar audio y comprobar si es menor a 5s */
async function downloadCustomAudio(interaction) {
    if (interaction.options.getString('subir_o_quitar') == 'add') {
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id].custom_audio == false) { // Could be undefined for old servers.
            interaction.reply({ content: 'No se permiten audios personalizados en este servidor.' });
            return;
        }
        const mp3 = interaction.options.getAttachment('mp3');
        if (!mp3) {
            interaction.reply({ content: 'No has adjuntado ningún archivo.', ephemeral: true });
            return;
        }
        if (mp3.size > process.env.MAX_CUSTOM_FILE_SIZE_BYTES) {
            interaction.reply({ content: 'El archivo debe ser inferior a 500KB.', ephemeral: true });
            return;
        } else if (mp3.contentType != 'audio/mpeg' || !mp3.attachment.toLowerCase().endsWith('.mp3')) { // only mp3
            interaction.reply({ content: 'El archivo debe ser de tipo .mp3', ephemeral: true });
            return;
        } else {
            const url = mp3.attachment;
            const res = await fetch(url);
            let buffer = await res.arrayBuffer();
            buffer = Buffer.from(buffer);
            let mp3_length, error;
            // temp file to get length of mp3
            let temp_file = fileSync();
            appendFile(temp_file.name, buffer, function (err) { if (err) { console.log(err); error = true; }; });
            try {
                mp3_length = await getMP3Length(temp_file.name);
            } catch (e) {
                error = true;
                console.log(e);
            }
            temp_file.removeCallback();

            if (error || mp3_length == undefined) {
                interaction.reply({ content: 'Ha sucedido un error.', ephemeral: true });
            } else if (mp3_length > Number(process.env.MAX_CUSTOM_AUDIO_LENGTH_SECS)) {
                interaction.reply({ content: `El archivo debe ser inferior a ${process.env.MAX_CUSTOM_AUDIO_LENGTH_SECS}s.`, ephemeral: true });
            } else { // Save mp3
                const guildID = interaction.guild.id;
                const userID = interaction.user.id;
                let targetDir = `./data/audioNombres/${guildID}`;
                mkdirSync(targetDir, { recursive: true });
                writeFileSync(targetDir + `/${userID}.mp3`, buffer, 'binary');
                // Save in DB
                let datos = await getDatabase('nombresAudio');
                if (datos[guildID] == undefined) {
                    datos[guildID] = {
                        "disabled": false,
                        "delante_o_detras": 'detras',
                        "frase": 'Se ha unido',
                        "idioma": 'es-es',
                        "genero": 'hombre',
                        "custom_audio": true
                    };
                }
                datos[guildID][userID] = [, 0, true]; // Custom audio
                await setDatabase('nombresAudio', datos);
                interaction.reply({ content: 'Audio guardado correctamente.', files: [mp3.attachment], ephemeral: false });
            }
        }
    } else {
        // Delete from DB
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id] == undefined) {
            interaction.reply({ content: 'Audio eliminado.', ephemeral: false });
            return;
        } else {
            delete datos[interaction.guild.id][interaction.user.id];
            await setDatabase('nombresAudio', datos);
            interaction.reply({ content: 'Audio eliminado.', ephemeral: false });
        }
    }
}


/** Permite, o no, que los usuarios usen un audio personalizado. */
async function allowCustomAudio(interaction, permitir) {
    permitir = permitir == 'yes';
    let datos = await getDatabase('nombresAudio');
    datos[interaction.guild.id]["custom_audio"] = permitir;
    await setDatabase('nombresAudio', datos);
    if (permitir) {
        interaction.reply({ content: 'Ahora ya se pueden utilizar audios personalizados.', ephemeral: false });
    } else {
        interaction.reply({ content: 'Ahora ya no se pueden utilizar audios personalizados.', ephemeral: false });
    }
}


/** Calcular duración del mp3 */
async function getMP3Length(path) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(path, function (err, metadata) {
            if (err) {
                reject(err);
            } else {
                resolve(metadata?.format.duration);
            }
        });
    });
}


export { avisos, espanol, idioma, frase, downloadCustomAudio, allowCustomAudio };