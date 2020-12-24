
document.querySelector('#records-btn').addEventListener('click', () => {
    ipcRenderer.send('records:clicked');
});

document.querySelector('#play-btn').addEventListener('click', () => {
    ipcRenderer.send('play:clicked');
});