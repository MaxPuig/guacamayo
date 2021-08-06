# Bot Discord
[Link de invitación](https://bot.maxpuig.com)

## FUNCIONES
- Avisa por el canal de voz quien se ha unido.
- Envía ofertas de juegos gratis.
- Crea listas de jugadores.
- Juego: xgame.

## COMANDOS de Barra [/]
- `/help`: Envía todos los comandos.
- `/invite`: Envía el link de invitación del Bot.
- `/activity`: Juega o mira videos de YouTube directamente desde una llamada.
- `/lista <Opcional: Nombre de lista>`: Empieza una lista de nombres. Hay que pulsar un botón para unirse.
- `/xgame <Tamaño>`: Juego. Objetivo: ocultar todas las "x".
- `/rss` [Solo Admin]: Establece (o quita) ese canal de texto para recibir ofertas de juegos gratis.
- `/voz` [Solo Admin]: Cambia los ajustes de los avisos de voz.

## SETUP
```Es necesario tener una clave/credencial de google para usar su TTS```
- instalar node.js y npm si no lo están:
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm cache clean -f
sudo npm install -g n
sudo n latest
```
- Descargar los archivos del bot ```git clone https://github.com/MaxPuig/bot-discord-js-v13.git```
- Descargar los paquetes ```npm install```
- Crear el archivo .env ```sudo nano .env``` y ahí escribir con los propios datos:
```
TOKEN="Token.del.bot"
INVITELINK=https://bot_invite_link.com
PATHGOOGLE="path/to/google_key.json"
```
- ```ctrl + x```, ```y```, ```enter ↵``` para guardar y salir del .env

Ejecutar bot con ```node index.js```. 
Para parar el bot ```ctrl + c```
