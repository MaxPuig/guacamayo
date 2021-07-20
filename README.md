# Bot Discord
[Link de invitación](https://discord.com/api/oauth2/authorize?client_id=710608604876767323&permissions=2150952000&scope=bot)

## FUNCIONES
- Avisa por el canal de voz quien se ha unido (Usando Google TTS)
- Envía ofertas de juegos gratis
- Prefijo personalizable ("." por defecto)
- Crea listas de jugadores
- Reenvia mensajes a otro servidor/canal
- Juegos (xgame, 3 en Raya y Conecta 4)

## COMANDOS
- `.prefijo <nuevo prefijo>` para cambiar el prefijo de los comandos. Ejemplo `.prefijo !` (Solo admin)
- `.voz <activar/desactivar>` para activar/desactivar los avisos de quien se une a un canal de voz. (Solo admin)
- `.rss` para establecer ese canal de texto para recibir ofertas de juegos. `.rss borrar` para deshacerlo. (Solo admin)
- `.relay` info sobre como mandar mensajes entre servidores. (Solo admin)
- `.lista` para empezar una lista de nombres. Hay que pulsar el botón para unirse.
- `.xgame` (Juego) para dimensiones aleatorias o `.xgame 4x5` para tamaño personalizado (mínimo: 3x3, máximo: 5x5).

## SETUP
```Es necesario tener una clave/credencial de google para usar su TTS```
- instalar node.js y npm si no lo están:
```
sudo apt update
sudo apt install nodejs
sudo apt install npm
sudo npm cache clean -f
sudo npm install -g n
sudo n stable
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

Ejecutar bot con ```node index.js```
Para parar el bot ```ctrl + c```
