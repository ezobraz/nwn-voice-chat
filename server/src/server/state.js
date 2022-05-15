let players = [];

const publify = players => players.map(player => {
    const tmp = {...player};

    delete tmp.pin;
    delete tmp.socket;

    return tmp;
});

module.exports = {
    insert(data) {
        if (!data.uuid) {
            return;
        }

        let existingPlayer = players.some(player => player.pin == data.pin);

        if (existingPlayer) {
            players = players.map(player => {
                if (player.pin == data.pin) {
                    for (let i in data) {
                        player[i] = data[i];
                    }
                }

                return player;
            });
            return;
        }

        players.push(data);
    },

    getPlayerByUUID(uuid) {
        return players.find(player => player.uuid === uuid);
    },

    removePlayerByUUID(uuid) {
        players = players.filter(player => player.uuid != uuid);
    },

    getAllPlayers() {
        return players;
    },

    findPlayerByPin(pin) {
        return players.find(player => player.pin == pin);
    },

    getConnectedPlayers() {
        return players.filter(player => player.socket);
    },

    getPublifiedConnectedPlayersByLoc(loc) {
        return publify(players.filter(player => player.loc === loc && player.socket));
    },
}
