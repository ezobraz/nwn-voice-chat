import './styles.less';
import { socket } from './socket.js';
import Peer from 'peerjs';
import Listener from './listener.js';
import Dom from './dom.js';

if (!Dom.getIsBrowserSupported()) {
    Dom.setError("For now it only works in Firefox. You won't hear anything in Chrome.")
}

let callList = [];
let myStream;
let myPlayer;

Dom.onFormSubmit((pinValue) => {
    Dom.hideForm();
    Dom.setError(null);

    if (!navigator.mediaDevices) {
        Dom.setError("Looks like we can't access your microphone. Refresh the page and try again.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        myStream = stream;
        socket.emit('auth', pinValue);
    }).catch(() => {
        Dom.setError("Something went wrong. Please, refresh the page and try again.");
    });
});

const callEveryone = (peer, myUuid, players) => {
    // call everyone in current location except myself
    for (const i in players) {
        const player = players[i];

        if (player.uuid === myUuid) {
            continue;
        }

        // if already on a call with the player, skip new call
        if (callList.some(call => call.peer === player.uuid)) {
            continue;
        }

        const call = peer.call(player.uuid, myStream);
        call.on('stream', (remoteStream) => {
            Listener.addStream(call.peer, remoteStream);
        });
        callList.push(call);
    }
}

const closeAllCalls = () => {
    callList.forEach(call => {
        Listener.removeAudioSource(call.peer);
        call.close()
    });
    callList = [];
}

const getMyPlayer = (uuid, players) => players.find(player => player.uuid === uuid);

// runs once when authorized
socket.on('success', ({ uuid, players }) => {

    myPlayer = getMyPlayer(uuid, players);

    const peer = new Peer(uuid);

    peer.on('open', (uuid) => {
        Dom.removeForm();
        Dom.showConnectedInfo();

        // answer all calls
        peer.on('call', (call) => {
            call.answer(myStream);
            call.on('stream', (remoteStream) => {
                Listener.addStream(call.peer, remoteStream);
            });
            callList.push(call);
        });

        callEveryone(peer, uuid, players);

        socket.on('update', (players) => {
            const me = getMyPlayer(uuid, players);

            if (myPlayer.loc !== me.loc) {
                closeAllCalls();
                callEveryone(peer, uuid, players);
            }

            // update muted/unmuted status
            myStream.getAudioTracks()[0].enabled = me.on ? true : false;
            Dom.updateMicStatus(me.on);

            myPlayer = me;

            // update listener position
            Listener.updateListener(me);

            // update other player poistions
            players.forEach(player => {
                if (player.uuid !== me.uuid) {
                    Listener.updateAudioSource(player);
                }
            });
        });
    });
});

socket.on('auth_error', (errorText) => {
    Dom.showForm();
    Dom.setError(errorText);
});
