import { ChannelType, ApplicationCommandOptionType, PermissionsBitField } from "discord.js";

const idiomas = [
    { name: "Afrikaans", value: "af" },
    { name: "Albanian", value: "sq" },
    { name: "Arabic", value: "ar" },
    // { "name": "Armenian", "value": "hy" },
    { name: "Catalan", value: "ca" },
    { name: "Chinese", value: "zh" },
    { name: "Chinese Mandarin China", value: "zh-cn" },
    // { "name": "Chinese Cantonese", "value": "zh-yue" },
    { name: "Croatian", value: "hr" },
    { name: "Czech", value: "cs" },
    { name: "Danish", value: "da" },
    { name: "Dutch", value: "nl" },
    { name: "English", value: "en" },
    { name: "English Australia", value: "en-au" },
    { name: "English United Kingdom", value: "en-uk" },
    { name: "English United States", value: "en-us" },
    { name: "Finnish", value: "fi" },
    { name: "French", value: "fr" },
    { name: "German", value: "de" },
    { name: "Greek", value: "el" },
    // { "name": "Haitian Creole", "value": "ht" },
    { name: "Hindi", value: "hi" },
    { name: "Hungarian", value: "hu" },
    { name: "Icelandic", value: "is" },
    { name: "Indonesian", value: "id" },
    { name: "Italian", value: "it" },
    { name: "Japanese", value: "ja" },
    { name: "Korean", value: "ko" },
    { name: "Latin", value: "la" },
    { name: "Latvian", value: "lv" },
    // { "name": "Macedonian", "value": "mk" },
    { name: "Norwegian", value: "no" },
    { name: "Polish", value: "pl" },
    { name: "Portuguese", value: "pt" },
    { name: "Portuguese Brazil", value: "pt-br" },
    { name: "Romanian", value: "ro" },
    { name: "Russian", value: "ru" },
    { name: "Serbian", value: "sr" },
    { name: "Slovak", value: "sk" },
    { name: "Spanish Spain", value: "es-es" },
    { name: "Spanish United States", value: "es-us" },
    { name: "Swahili", value: "sw" },
    { name: "Swedish", value: "sv" },
    { name: "Tamil", value: "ta" },
    { name: "Thai", value: "th" },
    { name: "Turkish", value: "tr" },
    { name: "Vietnamese", value: "vi" },
    // { "name": "Welsh", "value": "cy" }
];
let primeros = idiomas.slice(0, 24);
primeros.push({ name: "Más idiomas", value: "mas" });
let segundos = idiomas.slice(24, 50);
segundos.unshift({ name: "Ya he escogido", value: "ignorar" });

const help = {
    name: "help",
    description: "Muestra todos los comandos disponibles en un mensaje.",
};

const invite = {
    name: "invite",
    description: "Invita este bot a otros servidores.",
};

const feedback = {
    name: "feedback",
    description: "¿Tienes alguna sugerencia o feedback? Envía un mensaje al creador del bot.",
    options: [
        {
            name: "mensaje",
            type: ApplicationCommandOptionType.String,
            description: "Mensaje que quieres enviar.",
            required: true,
        },
    ],
};

const ofertas = {
    name: "ofertas",
    description: "Establece (o no) este canal para recibir ofertas de juegos gratis.",
    options: [
        {
            name: "establecer_o_quitar",
            type: ApplicationCommandOptionType.String,
            description: "Quieres recibir ofertas o quitarlas de este canal?",
            required: true,
            choices: [
                {
                    name: "establecer",
                    value: "establecer",
                },
                {
                    name: "quitar",
                    value: "quitar",
                },
            ],
        },
    ],
};

const voz = {
    name: "voz",
    description: "Cambiar ajustes de los avisos de voz.",
    options: [
        {
            name: "avisos",
            description: "Activa o deactiva los avisos en los canales de voz.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "activar_o_desactivar",
                    description: "Quieres activar o desactivar los avisos de voz?",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "Activar",
                            value: "activar",
                        },
                        {
                            name: "Desactivar",
                            value: "desactivar",
                        },
                    ],
                },
            ],
        },
        {
            name: "idioma",
            description: "Cambia el idioma de la voz.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "idioma_nuevo",
                    description: "Escoge el idioma.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: primeros,
                },
                {
                    name: "idioma_nuevo_2",
                    description: "Escoge el idioma si no lo has hecho antes.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: segundos,
                },
            ],
        },
        {
            name: "permitir_audio_personalizado",
            description: "Permitir que los usuarios suban su propio audio?",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "si_o_no",
                    type: ApplicationCommandOptionType.String,
                    description: "Permitir que los usuarios suban su propio audio?",
                    required: true,
                    choices: [
                        {
                            name: "Sí",
                            value: "yes",
                        },
                        {
                            name: "No",
                            value: "no",
                        },
                    ],
                },
            ],
        },
        {
            name: "audio_personalizado",
            description: "Sube tu propio audio para los avisos de voz.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "subir_o_quitar",
                    type: ApplicationCommandOptionType.String,
                    description: "Establecer o quitar el mp3?",
                    required: true,
                    choices: [
                        {
                            name: "Subir",
                            value: "add",
                        },
                        {
                            name: "Quitar",
                            value: "delete",
                        },
                    ],
                },
                {
                    name: "mp3",
                    type: ApplicationCommandOptionType.Attachment,
                    description: "Archivo mp3",
                    required: false,
                },
            ],
        },
        {
            name: "frase",
            description: "Cambia la frase que dice la voz.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "posición_nombre",
                    description: "El nombre va delante o detrás de la frase?",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "Delante",
                            value: "delante",
                        },
                        {
                            name: "Detrás",
                            value: "detras",
                        },
                    ],
                },
                {
                    name: "frase_nueva",
                    description: "Nueva frase. Ejemplo: se ha unido",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: "español",
            description: "Cambia la voz a español, hombre o mujer.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "género",
                    description: "Quieres que la voz en español sea hombre o mujer?",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: "Hombre",
                            value: "hombre",
                        },
                        {
                            name: "Mujer",
                            value: "mujer",
                        },
                    ],
                },
            ],
        },
    ],
};

const adminPerms = {
    name: "dar_permisos_bot",
    description: "Añade a gente para que pueda utilizar los comandos de solo Admin.",
    options: [
        {
            name: "dar_o_quitar",
            type: ApplicationCommandOptionType.String,
            description: "Dar o quitar permisos para usar los comandos al ususario?",
            required: true,
            choices: [
                {
                    name: "Dar permisos",
                    value: "add",
                },
                {
                    name: "Quitar permisos",
                    value: "delete",
                },
            ],
        },
        {
            name: "usuario",
            type: ApplicationCommandOptionType.User,
            description: "Usuario al que darle permisos para editar la comandos Admin como: /voz /ofertas",
            required: true,
        },
    ],
};

const activity = {
    name: "activity",
    description: "Empieza una actividad en el canal de voz.",
    options: [
        {
            name: "canal",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice],
            description: "Canal DE VOZ donde empezar la actividad.",
            required: true,
        },
        {
            name: "actividad",
            type: ApplicationCommandOptionType.String,
            description: "Actividad a empezar.",
            required: true,
            choices: [
                { name: "Watch Together", value: "880218394199220334" },
                { name: "Blazing 8s", value: "832025144389533716" },
                { name: "Bobble Bash", value: "1107689944685748377" },
                { name: "Bobble League", value: "947957217959759964" },
                { name: "Checkers In The Park", value: "832013003968348200" },
                { name: "Chef Showdown", value: "1037680572660727838" },
                { name: "Chess in the Park", value: "832012774040141894" },
                { name: "Colonist", value: "1106787098452832296" },
                { name: "Color Together", value: "1039835161136746497" },
                { name: "Gartic Phone", value: "1007373802981822582" },
                { name: "Jamspace Whiteboard", value: "1070087967294631976" },
                { name: "Know What I Meme", value: "950505761862189096" },
                { name: "Krunker Strike FRVR", value: "1011683823555199066" },
                { name: "land-io", value: "903769130790969345" },
                { name: "Letter League", value: "879863686565621790" },
                { name: "Poker Night", value: "755827207812677713" },
                { name: "Putt Party", value: "945737671223947305" },
                { name: "Sketch Heads", value: "902271654783242291" },
                { name: "SpellCast", value: "852509694341283871" },
                // Unreleased/Locked/Deprecated
                // { name: "Word Snacks", value: "879863976006127627" },
                // { name: "Ask Away", value: "976052223358406656" },
                // { name: "Bash Out", value: "1006584476094177371" },
                // { name: "Scrappies", value: "1000100849122553977" },
                // { name: "Awkword", value: "879863881349087252" },
                // { name: "Betrayal.io", value: "773336526917861400" },
                // { name: "Associations", value: "891001866073296967" }, // Decoders Dev
                // { name: "Fishington.io", value: "814288819477020702" },
                // { name: "Putts", value: "832012854282158180" },
                // { name: "Sketchy Artist", value: "879864070101172255" }, // Fake Artist
                // { name: "Youtube Together", value: "755600276941176913" },
            ],
        },
    ],
};

const enviar_oferta = {
    name: "enviar_oferta",
    description: "Envia una nueva oferta.",
    default_member_permissions: PermissionsBitField.Flags.Administrator,
    options: [
        {
            name: "titulo",
            type: ApplicationCommandOptionType.String,
            description: "Nombre del juego.",
            required: true,
        },
        {
            name: "link",
            type: ApplicationCommandOptionType.String,
            description: "Link de la oferta. Separar links con un espacio.",
            required: true,
        }
    ],
};

const all_commands_array = [help, voz, activity, feedback, invite, ofertas, adminPerms, enviar_oferta];

export { all_commands_array };
