# Proximity (3D) Voice Chat for NWN1

<img width="314" alt="Screenshot 2022-05-15 at 15 37 34" src="https://user-images.githubusercontent.com/14362460/168475745-4f6b440d-48a1-429e-8b41-79966906e011.png">

## Disclaimer
The whole thing was made in the most simple way possible, and currenlty is in early "alpha", so expect some bugs.

## How does it work?
Game Server dumps player locations in a log files, then Voice Chat Server grabs that data and shares it among the connected players who are in the same location.

On the client-side it's basicaly a tab in a browser that handles all the audio streaming, while players can mute and unmute themselves direclty from the game (thanks to the new NUI support)


## Technologies used
Websockets (with socket.io), WebRTC (with peer.js), Three.js (for proximity sound), node.js + express.js as a webserver, tail and chokidar to watch log files.


## For server administrators

1. Install `node` and `npm` for your OS
2. git clone this repository
3. Put absolute path to your server's log.0 directory in server/config.json
4. Generate certificates (or use letsencrypt if you have a domain name)
```
cd server/cert && chmod +x generate-certificates && ./generate-certificates.sh
```
5. Create/Edit your module and add scripts from module-scrips folder to your module
6. Attach `onClientEnter` and `onClientLeave` scripts to their respective events
7. Inside `onClientEnter` script, change `VC_URL` to your domain or server ip with 3000 port. It will be shown to players
8. Run the Game Server with your module
9. Build and launch the Voice Chat Server
```
cd server
npm i
npm run build
npm run start
```

## For players

- Join the server that has this voice chat plugin installed
- Notice the floating "Voice chat" window
- `Alt+Tab` and open a new firefox/safari/etc tab with the url you saw in the floating window
- Enter the 4 digit pin number you saw in the floating window
- Return to the game and press "On" button so others could hear you

It will not work in Chrome or any Chrome-based browsers like Brave, Edge, etc. Use Firefox.
