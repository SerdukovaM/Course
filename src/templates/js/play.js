
document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems, {});
});

document.querySelector('#back-btn').addEventListener('click', () => {
    ipcRenderer.send('back:clicked');
});

document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const nickname = document.querySelector('#nickname').value;
    const difficulty = document.querySelector('#difficulty').value;

    if (nickname.length == 0 || nickname.length > 16) {
        document.querySelector('#nickname').classList.add('invalid');
    } else {
        ipcRenderer.send('start-game:clicked', nickname, difficulty);
    }
});