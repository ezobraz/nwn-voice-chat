import * as THREE from 'three';

const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
const scene = new THREE.Scene();

camera.position.set(0, 0, 0);

let listener;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(100, 100);
renderer.setAnimationLoop((time) => {
    renderer.render(scene, camera);
});

document.body.appendChild(renderer.domElement);

const init = () => {
    if (!listener) {
        listener = new THREE.AudioListener();
        camera.add(listener);
    }
}

export default {
    addStream(uuid, stream) {
        init();

        const sphere = new THREE.SphereGeometry( 20, 32, 16 );
        const material = new THREE.MeshPhongMaterial( { color: 0xff2200 } );

        const object = new THREE.Mesh(sphere, material);
        const audioSource = new THREE.PositionalAudio(listener);

        audioSource.setMediaStreamSource(stream);
        audioSource.setVolume(1);
        audioSource.setRefDistance(1);
        audioSource.setMaxDistance(200);

        object.uuid = uuid;

        scene.add(object);
        object.position.set(0, 0, 0);
        object.add(audioSource);
    },

    updateListener(data) {
        init();
        camera.position.set(data.x, data.y, data.z);
        camera.rotation.y = THREE.Math.degToRad(data.angle);
    },

    removeAudioSource(uuid) {
        init();

        const object = scene.getObjectByProperty('uuid', uuid);
        object.geometry.dispose();
        object.material.dispose();
        scene.remove( object );
    },

    updateAudioSource(player) {
        init();

        const object = scene.getObjectByProperty('uuid', player.uuid);

        if (!object) {
            return;
        }

        object.position.set(player.x, player.y, player.z);
        object.rotation.y = THREE.Math.degToRad(player.angle);
    },
}
