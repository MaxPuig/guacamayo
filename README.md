# Bot Discord
[Link de invitación](https://bot.maxpuig.com)

## FUNCIONES
- Avisa por el canal de voz quien se ha unido (Usando Google TTS)
- Envía ofertas de juegos gratis
- Prefijo personalizable ("." por defecto)
- Crea listas de jugadores
- Reenvia mensajes a otro servidor/canal
- Juegos (xgame, 3 en Raya y Conecta 4)

## COMANDOS
- `.prefijo <nuevo prefijo> [Solo Admin]` para cambiar el prefijo de los comandos. Ejemplo `.prefijo !`
- `.voz <activar/desactivar> [Solo Admin]` para activar/desactivar los avisos de quien se une a un canal de voz.
- `.rss [Solo Admin]` para establecer ese canal de texto para recibir ofertas de juegos. `.rss borrar` para deshacerlo.
- `.relay [Solo Admin]` info sobre como mandar mensajes entre servidores.
- `.lista <Opcional: Nombre de lista>` para empezar una lista de nombres. Hay que pulsar el botón para unirse.
- `.xgame <Opcional: Tamaño>` (Juego) para dimensiones aleatorias o `.xgame 4x5` para tamaño personalizado (mínimo: 3x3, máximo: 5x5).

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
