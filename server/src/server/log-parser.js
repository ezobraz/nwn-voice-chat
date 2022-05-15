const state = require('./state.js');
const Tail = require('tail').Tail;
const chokidar = require('chokidar');
const config = require('../../config.json');

const initLogWatcher = (logFile) => {
    const tail = new Tail(logFile);

    tail.on('line', (data) => {
        if (data.startsWith('pos: ')) {
            const json = data.replace('pos: ', '');
            const obj = JSON.parse(json);

            state.insert(obj);

            const players = state.getConnectedPlayers();

            players.forEach(player => {
                player.socket.emit('update', state.getPublifiedConnectedPlayersByLoc(player.loc));
            });
            return;
        }

        if (data.startsWith('left: ')) {
            const uuid = data.replace('left: ', '');
            const player = state.getPLayerByUUID(uuid);

            if (player && player.socket) {
                player.socket.disconnect();
                console.log(`Player ${player.name} left the game, therefore has been kicked out from the voice chat`);
            }

            state.removePlayerByUUID(uuid);
        }
    });

    tail.on('error', (error) => {
        console.log('ERROR: ', error);
    });

    return tail;
}

let currentTail;

const watcher = chokidar.watch(config['log-folder-path']).on('add', (path) => {
    if (path.includes('nwserverLog')) {
        try {
            currentTail.unwatch();
        } catch (e) {}

        currentTail = initLogWatcher(path);
    }
});
