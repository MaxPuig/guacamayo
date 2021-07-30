import { getDatabase, setDatabase } from './database.js';


/** Activa o desactiva los avisos en el canal de voz. */
async function avisos(interaction, voz_activa) {
    if (voz_activa == 'activar') {
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id] != undefined) {
            datos[interaction.guild.id]["disabled"] = false;
            interaction.reply('Avisos de voz activados. `/voz avisos` para deshacer.');
        } else {
            datos[interaction.guild.id] = {
                "disabled": false,
                "delante_o_detras": "detras",
                "frase": "Se ha unido",
                "idioma": "es-es",
                "genero": "hombre"
            };
            interaction.reply('Avisos de voz activados. `/voz avisos` para deshacer.');
        }
        setDatabase('nombresAudio', datos);
    } else {
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id] != undefined) {
            datos[interaction.guild.id]["disabled"] = true;
            interaction.reply('Avisos de voz desactivados. `/voz avisos` para deshacer.');
        } else {
            datos[interaction.guild.id] = {
                "disabled": true,
                "delante_o_detras": "detras",
                "frase": "Se ha unido",
                "idioma": "es-es",
                "genero": "hombre"
            };
            interaction.reply('Avisos de voz desactivados. `/voz avisos` para deshacer.');
        }
        setDatabase('nombresAudio', datos);
    }
}


/** Restablece los ajustes (frase, idioma, genero). */
async function default_settings(interaction, args) {
    let datos = await getDatabase('nombresAudio');
    let nuevosdatos = {
        "disabled": false,
        "delante_o_detras": "detras",
        "frase": "Se ha unido",
        "idioma": "es-es",
        "genero": "hombre"
    }
    datos[interaction.guild.id] = nuevosdatos;
    interaction.reply(`Voz reseteada a español hombre. Los audios serán así: ${nuevosdatos.frase} ${interaction.member.displayName}.`);
    setDatabase('nombresAudio', datos);
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
                "genero": "hombre"
            };
            datos[interaction.guild.id] = nuevosdatos;
            interaction.reply('Voz cambiada a español hombre.');
            setDatabase('nombresAudio', datos);
        } else {
            interaction.reply('La voz ya era español hombre.');
        }
    } else {
        let datos = await getDatabase('nombresAudio');
        if (datos[interaction.guild.id].genero == 'hombre' || datos[interaction.guild.id].idioma != 'es-es') {
            let nuevosdatos = { // Borra todo para volver a descargar todos los audios.
                "disabled": datos[interaction.guild.id].disabled,
                "delante_o_detras": datos[interaction.guild.id].delante_o_detras,
                "frase": datos[interaction.guild.id].frase,
                "idioma": 'es-es',
                "genero": "mujer"
            };
            datos[interaction.guild.id] = nuevosdatos;
            interaction.reply('Voz cambiada a español mujer.');
            setDatabase('nombresAudio', datos);
        } else {
            interaction.reply('La voz ya era español mujer.');
        }
    }
}


/** Cambia el idioma de la voz. */
async function idioma(interaction, idioma_nuevo, idioma_nuevo_2) {
    let idioma;
    if (idioma_nuevo == 'mas' && idioma_nuevo_2 == 'ignorar') {
        interaction.reply('Has escogido mal el idioma. (Has escogido `más_idiomas` y `ya_he_escogido`).');
        return;
    } else if (idioma_nuevo == 'mas' && idioma_nuevo_2 != 'ignorar') {
        idioma = idioma_nuevo_2;
    } else if (idioma_nuevo != 'mas' && idioma_nuevo_2 == 'ignorar') {
        idioma = idioma_nuevo;
    } else {
        interaction.reply('Has escogido 2 idiomas. En el primer menú puedes seleccionar `más_idiomas`. En el segundo menú puedes seleccionar `ya_he_escogido`.');
        return;
    }
    let datos = await getDatabase('nombresAudio');
    if (idioma != datos[interaction.guild.id].idioma) {
        let nuevosdatos = {
            "disabled": datos[interaction.guild.id].disabled,
            "delante_o_detras": datos[interaction.guild.id].delante_o_detras,
            "frase": datos[interaction.guild.id].frase,
            "idioma": idioma,
            "genero": 'mujer'
        };
        datos[interaction.guild.id] = nuevosdatos;
        interaction.reply(`Idioma cambiado a ${idioma}.`);
        setDatabase('nombresAudio', datos);
    } else {
        interaction.reply('El idioma ya es este.');
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
        "genero": datos[interaction.guild.id].genero
    };
    datos[interaction.guild.id] = nuevosdatos;
    if (posicion_nombre == 'delante') {
        interaction.reply(`Ahora los audios serán así: ${interaction.member.displayName} ${nuevosdatos.frase}.`);
    } else {
        interaction.reply(`Ahora los audios serán así: ${nuevosdatos.frase} ${interaction.member.displayName}.`);
    }
    setDatabase('nombresAudio', datos);
}


export { avisos, default_settings, espanol, idioma, frase };