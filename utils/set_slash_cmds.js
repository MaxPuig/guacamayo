/** Esto deberá pegarse en index.js para crear los slash commands. */
const idiomas = [
    { "name": "Afrikaans", "value": "af" },
    { "name": "Albanian", "value": "sq" },
    { "name": "Arabic", "value": "ar" },
    { "name": "Armenian", "value": "hy" },
    { "name": "Catalan", "value": "ca" },
    { "name": "Chinese", "value": "zh" },
    { "name": "Chinese Mandarin China", "value": "zh-cn" },
    { "name": "Chinese Cantonese", "value": "zh-yue" },
    { "name": "Croatian", "value": "hr" },
    { "name": "Czech", "value": "cs" },
    { "name": "Danish", "value": "da" },
    { "name": "Dutch", "value": "nl" },
    { "name": "English", "value": "en" },
    { "name": "English Australia", "value": "en-au" },
    { "name": "English United Kingdom", "value": "en-uk" },
    { "name": "English United States", "value": "en-us" },
    { "name": "Finnish", "value": "fi" },
    { "name": "French", "value": "fr" },
    { "name": "German", "value": "de" },
    { "name": "Greek", "value": "el" },
    { "name": "Haitian Creole", "value": "ht" },
    { "name": "Hindi", "value": "hi" },
    { "name": "Hungarian", "value": "hu" },
    { "name": "Icelandic", "value": "is" },
    { "name": "Indonesian", "value": "id" },
    { "name": "Italian", "value": "it" },
    { "name": "Japanese", "value": "ja" },
    { "name": "Korean", "value": "ko" },
    { "name": "Latin", "value": "la" },
    { "name": "Latvian", "value": "lv" },
    { "name": "Macedonian", "value": "mk" },
    { "name": "Norwegian", "value": "no" },
    { "name": "Polish", "value": "pl" },
    { "name": "Portuguese", "value": "pt" },
    { "name": "Portuguese Brazil", "value": "pt-br" },
    { "name": "Romanian", "value": "ro" },
    { "name": "Russian", "value": "ru" },
    { "name": "Serbian", "value": "sr" },
    { "name": "Slovak", "value": "sk" },
    { "name": "Spanish Spain", "value": "es-es" },
    { "name": "Spanish United States", "value": "es-us" },
    { "name": "Swahili", "value": "sw" },
    { "name": "Swedish", "value": "sv" },
    { "name": "Tamil", "value": "ta" },
    { "name": "Thai", "value": "th" },
    { "name": "Turkish", "value": "tr" },
    { "name": "Vietnamese", "value": "vi" },
    { "name": "Welsh", "value": "cy" }
]
let primeros = idiomas.slice(0, 24);
primeros.push({ "name": "Más idiomas", "value": "mas" });
let segundos = idiomas.slice(24, 50);
segundos.unshift({ "name": "Ya he escogido", "value": "ignorar" });

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
            name: 'Establecer',
            value: 'establecer',
        },
        {
            name: 'Quitar',
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
                    name: 'Activar',
                    value: 'activar'
                },
                {
                    name: 'Desactivar',
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
                    name: 'Hombre',
                    value: 'hombre'
                },
                {
                    name: 'Mujer',
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
                    name: 'Delante',
                    value: 'delante'
                },
                {
                    name: 'Detrás',
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
            name: 'Random',
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
            name: 'Random',
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

const adminPerms = {
    name: 'dar_permisos_bot',
    description: 'Añade a gente para que pueda utilizar los comandos de solo Admin.',
    options: [{
        name: 'dar_o_quitar',
        type: 'STRING',
        description: 'Dar o quitar permisos para usar los comandos al ususario?',
        required: true,
        choices: [{
            name: 'Dar permisos',
            value: 'add'
        },
        {
            name: 'Quitar permisos',
            value: 'delete'
        }]
    },
    {
        name: 'usuario',
        type: 'USER',
        description: 'Usuario al que darle permisos para editar la comandos Admin como: /voz /rss',
        required: true
    }]
}


const all_commands_array = [help, invite, lista, rss, voz, xgame, adminPerms];
// Global
// const commands = await client.application?.commands.set([help, invite, lista, rss, voz, xgame]);
// En solo 1 servidor
// await client.guilds.cache.get(guildID)?.commands.set([help, invite, lista, rss, voz, xgame]);
// console.log(commands);

export { all_commands_array }