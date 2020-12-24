
const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.fixed-action-btn');
    let instances = M.FloatingActionButton.init(elems, {});
});

document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('#exit-modal');
    let instances = M.Modal.init(elems, {});
});

document.querySelector('#exit-btn').addEventListener('click', () => {
    let elem = document.querySelector('#exit-modal');
    let instance = M.Modal.getInstance(elem);
    instance.open();
});

document.querySelector('#exit-confirm-btn').addEventListener('click', () => {
    ipcRenderer.send('exit:confirmed');
});

ipcRenderer.on('exit:clicked', () => {
    let elem = document.querySelector('#exit-modal');
    let instance = M.Modal.getInstance(elem);
    instance.open();
});