
document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('#lose-modal');
    M.Modal.init(elems, {
        dismissible: false
    });

    elems = document.querySelectorAll('#win-modal');
    M.Modal.init(elems, {
        dismissible: false
    });
});

document.querySelectorAll('.back-btn').forEach(el => {
    el.addEventListener('click', () => {
        ipcRenderer.send('back:clicked');
    });
});

document.querySelector('#win-btn').addEventListener('click', () => {
    ipcRenderer.send('win-btn:clicked');
    console.log('DONE!');
});

