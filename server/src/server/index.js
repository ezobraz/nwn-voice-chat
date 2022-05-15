const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const socketIo = require('socket.io');
const state = require('./state.js');

require('./log-parser.js');

const app = express();

app.use(express.static('public'));

const server = https.createServer({
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.cert')
}, app);

const io = socketIo(server);

app.get('/', (req, res) => {
    res.sendFile('public/index.html');
});

server.listen(3000, () => {
    console.log(`Server is up and running at port 3000`);
});

io.on('connection', (socket) => {
    socket.on('auth', (pin) => {
        const player = state.findPlayerByPin(pin);

        if (!player) {
            socket.emit('error');
            return;
        }

        player.socket = socket;
        player.socket.emit('success', {
            uuid: player.uuid,
            players: state.getPublifiedConnectedPlayersByLoc(player.loc),
        });

        console.log(`Player ${player.name} in ${player.loc} connected to voice chat`);
    });
});
