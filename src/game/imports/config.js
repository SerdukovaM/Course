
import { globals } from "./globals.js";

const fs = require('fs');
const path = require('path');

export class Config {
    static load() {
        if (!globals.config) {
            globals.config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'config.json')));
        }
    }
}