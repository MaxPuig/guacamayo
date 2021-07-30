/** Esto deberá pegarse en index.js para crear los slash commands. */
client.on('messageCreate', async message => {
    const guildID = '1234556789'; // Replace with your guild ID for slash commands
    const idiomas = [
        { "name": "afrikaans", "value": "af" },
        { "name": "albanian", "value": "sq" },
        { "name": "arabic", "value": "ar" },
        { "name": "armenian", "value": "hy" },
        { "name": "catalan", "value": "ca" },
        { "name": "chinese", "value": "zh" },
        { "name": "chinese_mandarin_china", "value": "zh-cn" },
        { "name": "chinese_cantonese", "value": "zh-yue" },
        { "name": "croatian", "value": "hr" },
        { "name": "czech", "value": "cs" },
        { "name": "danish", "value": "da" },
        { "name": "dutch", "value": "nl" },
        { "name": "english", "value": "en" },
        { "name": "english_australia", "value": "en-au" },
        { "name": "english_united_kingdom", "value": "en-uk" },
        { "name": "english_united_states", "value": "en-us" },
        { "name": "finnish", "value": "fi" },
        { "name": "french", "value": "fr" },
        { "name": "german", "value": "de" },
        { "name": "greek", "value": "el" },
        { "name": "haitian_creole", "value": "ht" },
        { "name": "hindi", "value": "hi" },
        { "name": "hungarian", "value": "hu" },
        { "name": "icelandic", "value": "is" },
        { "name": "indonesian", "value": "id" },
        { "name": "italian", "value": "it" },
        { "name": "japanese", "value": "ja" },
        { "name": "korean", "value": "ko" },
        { "name": "latin", "value": "la" },
        { "name": "latvian", "value": "lv" },
        { "name": "macedonian", "value": "mk" },
        { "name": "norwegian", "value": "no" },
        { "name": "polish", "value": "pl" },
        { "name": "portuguese", "value": "pt" },
        { "name": "portuguese_brazil", "value": "pt-br" },
        { "name": "romanian", "value": "ro" },
        { "name": "russian", "value": "ru" },
        { "name": "serbian", "value": "sr" },
        { "name": "slovak", "value": "sk" },
        { "name": "spanish_spain", "value": "es-es" },
        { "name": "spanish_united_states", "value": "es-us" },
        { "name": "swahili", "value": "sw" },
        { "name": "swedish", "value": "sv" },
        { "name": "tamil", "value": "ta" },
        { "name": "thai", "value": "th" },
        { "name": "turkish", "value": "tr" },
        { "name": "vietnamese", "value": "vi" },
        { "name": "welsh", "value": "cy" }
    ]
    let primeros = idiomas.slice(0, 24);
    primeros.push({ "name": "más_idiomas", "value": "mas" });
    let segundos = idiomas.slice(24, 50);
    segundos.unshift({ "name": "ya_he_escogido", "value": "ignorar" });

    const help = {
        name: 'help',
        description: 'Muestra todos los comandos disponibles en un mensaje.'
    }

    const invite = {
        name: 'invite',
        description: 'Invita este bot a otros servidores.'
    }

    const lista = {
        name: 'lista',
        description: 'Crea una lista a la que se puede unir la gente.',
        options: [{
            name: 'nombre_lista',
            type: 'STRING',
            description: 'Nombre de la lista.',
            required: false
        }]
    }

    const rss = {
        name: 'rss',
        description: 'Establece (o no) este canal para recibir ofertas de juegos gratis.',
        options: [{
            name: 'establecer_o_quitar',
            type: 'STRING',
            description: 'Quieres recibir ofertas o quitarlas de este canal?',
            required: true,
            choices: [{
                name: 'establecer',
                value: 'establecer',
            },
            {
                name: 'quitar',
                value: 'quitar',
            }]
        }]
    }

    const voz = {
        name: 'voz',
        description: 'Cambiar ajustes de los avisos de voz.',
        options: [
            {
                name: 'avisos',
                description: 'Activa o deactiva los avisos en los canales de voz.',
                type: 'SUB_COMMAND', // 2 is type SUB_COMMAND_GROUP
                options: [{
                    name: 'activar_o_desactivar',
                    description: 'Quieres activar o desactivar los avisos de voz?',
                    type: 'STRING',
                    required: true,
                    choices: [{
                        name: 'activar',
                        value: 'activar'
                    },
                    {
                        name: 'desactivar',
                        value: 'desactivar'
                    }]
                }]
            },
            {
                name: 'dafault',
                description: 'Reinicia los ajustes de voz a español, hombre.',
                type: 'SUB_COMMAND'
            },
            {
                name: 'español',
                description: 'Cambia el genero de voz (Solo español).',
                type: 'SUB_COMMAND',
                options: [{
                    name: 'género',
                    description: 'Quieres que la voz en español sea hombre o mujer?',
                    type: 'STRING',
                    required: true,
                    choices: [{
                        name: 'hombre',
                        value: 'hombre'
                    },
                    {
                        name: 'mujer',
                        value: 'mujer'
                    }]
                }]
            },
            {
                name: 'idioma',
                description: 'Cambia el idioma de la voz.',
                type: 'SUB_COMMAND',
                options: [{
                    name: 'idioma_nuevo',
                    description: 'Escoge el idioma.',
                    type: 'STRING',
                    required: true,
                    choices: primeros
                },
                {
                    name: 'idioma_nuevo_2',
                    description: 'Escoge el idioma si no lo has hecho antes.',
                    type: 'STRING',
                    required: true,
                    choices: segundos
                }]
            },
            {
                name: 'frase',
                description: 'Cambia la frase que dice la voz.',
                type: 'SUB_COMMAND',
                options: [{
                    name: 'posición_nombre',
                    description: 'El nombre va delante o detrás de la frase?',
                    type: 'STRING',
                    required: true,
                    choices: [{
                        name: 'delante',
                        value: 'delante'
                    },
                    {
                        name: 'detrás',
                        value: 'detras'
                    }]
                },
                {
                    name: 'frase_nueva',
                    description: 'Nueva frase. Ejemplo: se ha unido',
                    type: 'STRING',
                    required: true
                }]
            }]
    }

    const xgame = {
        name: 'xgame',
        description: 'Empezar partida xgame.',
        options: [{
            name: 'tamaño_x',
            type: 'INTEGER',
            description: 'Tamaño "X" del tablero.',
            required: true,
            choices: [{
                name: 'random',
                value: 0,
            },
            {
                name: '3',
                value: 3,
            },
            {
                name: '4',
                value: 4,
            },
            {
                name: '5',
                value: 5,
            }]
        },
        {
            name: 'tamaño_y',
            type: 'INTEGER',
            description: 'Tamaño "Y" del tablero.',
            required: true,
            choices: [{
                name: 'random',
                value: 0,
            },
            {
                name: '3',
                value: 3,
            },
            {
                name: '4',
                value: 4,
            },
            {
                name: '5',
                value: 5,
            }]
        }]
    }
    // Global
    // const commands = await client.application?.commands.set([help, invite, lista, rss, voz, xgame]);
    // En solo 1 servidor
    // await client.guilds.cache.get(guildID)?.commands.set([help, invite, lista, rss, voz, xgame]);
    // console.log(commands);
});