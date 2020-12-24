
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const Store = require('electron-store');

const sqlite3 = require('sqlite3').verbose();

// require('electron-reload')(__dirname);

// const env = process.env.NODE_ENV;
const env = 'production';
const store = new Store();

let windowObj = null;

async function loadTemplate(template) {
    await windowObj.loadURL(url.format({
        pathname: path.join(__dirname, 'src', 'templates', template),
        protocol: 'file:',
        slashes: true
    }));
}

function getRecordsData(callback) {
    let data = [];
    let db = new sqlite3.Database(path.join(__dirname, '..', 'database.db'), sqlite3.OPEN_READWRITE);

    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS "records" ("nickname"	TEXT NOT NULL, "difficulty"	INTEGER, "score" INTEGER)`);
        db.each("SELECT nickname, difficulty, score FROM records ORDER BY score, difficulty LIMIT 5", (err, row) => {
            data.push(row);
        }, () => {
            db.close();
            callback(data);
        });
    });
}

function createWindow() {
    windowObj = new BrowserWindow({
        width: 900,
        height: 600,
        minWidth: 900,
        minHeight: 600,
        title: 'Agar.io',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    if (env == 'production') {
        Menu.setApplicationMenu(null);
    }

    loadTemplate('welcome.html');

    windowObj.on('close', (event) => {
        event.preventDefault();
        windowObj.webContents.send('exit:clicked');
    });

    windowObj.on('closed', () => {
        windowObj = null;
        app.quit();
    });
}

app.on('ready', () => {
    createWindow();
});

ipcMain.on('exit:confirmed', () => {
    windowObj.destroy();
});

ipcMain.on('records:clicked', async () => {
    await loadTemplate('records.html');
    getRecordsData((data) => {
        windowObj.webContents.send('records:data', data);
    });
});

ipcMain.on('play:clicked', () => {
    loadTemplate('play.html');
});

ipcMain.on('start-game:clicked', (event, nickname, difficulty) => {
    store.set('nickname', nickname);
    store.set('difficulty', difficulty);
    loadTemplate('game.html');
});

ipcMain.on('back:clicked', () => {
    loadTemplate('welcome.html');
});

ipcMain.on('win-btn:clicked', async () => {
    await loadTemplate('welcome.html');

    let db = new sqlite3.Database(path.join(__dirname, '..', 'database.db'), sqlite3.OPEN_READWRITE);
    db.run(`CREATE TABLE IF NOT EXISTS "records" ("nickname" TEXT NOT NULL, "difficulty" INTEGER, "score" INTEGER)`);
    db.run(`INSERT INTO records VALUES("${store.get('nickname')}", ${store.get('difficulty')}, ${store.get('score')})`);
    db.close();
});

ipcMain.handle('getStoreValue', (event, key) => {
    return store.get(key);
});

ipcMain.handle('setStoreValue', (event, key, value) => {
    store.set(key, value);
});