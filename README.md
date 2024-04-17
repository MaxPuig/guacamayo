# Guacamayo: Discord bot
[Link de invitación](https://discord.com/oauth2/authorize?client_id=710608604876767323&permissions=2150680648&scope=bot%20applications.commands)

## FUNCIONES
- Avisa por el canal de voz quien se ha unido.
- Juega o mira videos de YouTube directamente desde una llamada.
- Envía ofertas de juegos gratis.

## COMANDOS de Barra [/]
- `/help`: Envía todos los comandos.
- `/invite`: Envía el link de invitación del Bot.
- `/activity`: Juega o mira videos de YouTube directamente desde una llamada.
- `/feedback <Mensaje>`: Envía un mensaje al creador del bot.
- `/ofertas [Solo Admin]`: Establece (o quita) ese canal de texto para recibir ofertas de juegos gratis.
- `/voz [Solo Admin]`: Cambia los ajustes de los avisos de voz.
- `/dar_permisos_bot [Solo Admin]`: Dar permiso a otro usuario para usar comandos [Solo Admin].

## SETUP
```Es necesario tener una clave/credencial de google para usar el TTS.``` Se especifica la ubicación en el archivo `.env`. 
- instalar node.js (versión>=16.6.0) y npm si no lo están:
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
```
- Descargar los archivos del bot ```git clone https://github.com/MaxPuig/guacamayo.git```
- Entrar a la carpeta ```cd guacamayo```
- Descargar los paquetes ```npm install```
- Crear el archivo .env ```sudo nano .env``` y ahí escribir con los propios datos:
```
TOKEN       = "Token.del.bot"
BOT_ADMIN   = "12345_admin_Id_67890"
INVITELINK  = "https://bot_invite_link.com"
PATHGOOGLE  = "path/to/google_key.json"
MINUTES_BEFORE_AUTOSEND_FREE_GAME = 20
MAX_CUSTOM_AUDIO_LENGTH_SECS = 5
MAX_CUSTOM_FILE_SIZE_BYTES = 500000
```
- ```Ctrl + x```, ```y```, ```enter ↵``` para guardar y salir del .env

Ejecutar bot con ```node index.js```. 

```Ctrl + c``` para parar el bot.
