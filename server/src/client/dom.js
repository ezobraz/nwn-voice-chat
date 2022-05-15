const errorBox = document.querySelector('#errorBox');
const form = document.querySelector('#form');
const pinInput = document.querySelector('#pin');
const connected = document.querySelector('#connected');
const micStatus = document.querySelector('#micStatus');

export default {
    getIsBrowserSupported() {
        let isFirefox = false;
        try {
            isFirefox = window.navigator.userAgent.toLowerCase().includes('firefox');
        } catch (e) {}

        return isFirefox;
    },

    setError(text) {
        if (text) {
            errorBox.innerText = text;
            errorBox.classList.remove('hidden');
            return;
        }

        errorBox.classList.add('hidden');
    },

    showForm() {
        form.classList.remove('hidden');
    },

    hideForm() {
        form.classList.add('hidden');
    },

    removeForm() {
        form.remove();
    },

    onFormSubmit(cb) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!pinInput.value) {
                return;
            }

            cb(pinInput.value);
        })
    },

    showConnectedInfo() {
        connected.classList.remove('hidden');
    },

    updateMicStatus(value) {
        if (value && micStatus.classList.has('muted')) {
            micStatus.classList.remove('muted');
        } else if (!micStatus.classList.has('muted')) {
            micStatus.classList.add('muted');
        }
    },
};
