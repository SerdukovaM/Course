
import { globals } from "./globals.js";

const { ipcRenderer } = require('electron');

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function stopwatchUpdate() {
    globals.stopwatchValue += 1;
    let stopwatchValue;
    if (globals.stopwatchValue > 59) {
        stopwatchValue = `${Math.floor(globals.stopwatchValue / 60)} мин. ${globals.stopwatchValue % 60} сек.`;
    } else {
        stopwatchValue = `${globals.stopwatchValue} сек.`;
    }
    document.querySelector('#stopwatch').innerHTML = stopwatchValue;
}

export async function winHandler() {
    window.cancelAnimationFrame(globals.animationFrameTimer);
    clearInterval(globals.stopwatchTimer);
    clearInterval(globals.foodRespawnTimer);

    await ipcRenderer.invoke('setStoreValue', 'nickname', globals.player.nickname);
    await ipcRenderer.invoke('setStoreValue', 'difficulty', globals.difficulty);
    await ipcRenderer.invoke('setStoreValue', 'score', globals.stopwatchValue);

    let elem = document.querySelector('#win-modal');
    let instance = M.Modal.getInstance(elem);
    
    instance.open();
}

export function loseHandler() {
    window.cancelAnimationFrame(globals.animationFrameTimer);
    clearInterval(globals.stopwatchTimer);
    clearInterval(globals.foodRespawnTimer);
    
    let elem = document.querySelector('#lose-modal');
    let instance = M.Modal.getInstance(elem);

    instance.open();
}