
import { globals } from "./globals.js";
import { Player } from "./player.js";
import { getRandomInt, loseHandler } from "./utils.js"

const Vector = require('victor');
const { ipcRenderer } = require('electron');

export class Bot extends Player {
    constructor(positionX, positionY, radius, color, strokeColor, nickname) {
        super(positionX, positionY, radius, color, strokeColor, nickname);
    }

    move() {
        if (globals.player && globals.player.alive) {
            let velocity = new Vector();

            if (this.radius > globals.player.radius * 1.5) {
                velocity.copy(globals.player.position);
            } else if (globals.food.length > 0) {
                let min = globals.food[0].position.distance(this.position), index = 0;
                for (let i = 1; i < globals.food.length; i++) {
                    let temp = this.position.distance(globals.food[i].position);
                    if (temp < min) {
                        min = temp;
                        index = i;
                    }
                }
                velocity.copy(globals.food[index].position);
            }
            velocity.subtract(this.position).norm().multiplyScalar(1 + parseInt(globals.difficulty, 10));
            this.position.add(velocity);
            this.checkBoundaries();  
        }
    }

    static async spawn() {
        for (let i = 0; i < globals.config.bot.amount; i++) {
            globals.bots.push(new Bot(
                getRandomInt(-globals.config.world.width / 2 + globals.config.bot.start.radius, globals.config.world.width / 2 - globals.config.bot.start.radius),
                getRandomInt(-globals.config.world.height / 2 + globals.config.bot.start.radius, globals.config.world.height / 2 - globals.config.bot.start.radius),
                globals.config.bot.start.radius,
                globals.config.bot.color,
                globals.config.bot.strokeColor,
                globals.config.bot.nickname
            ));
        }

        globals.difficulty = await ipcRenderer.invoke('getStoreValue', 'difficulty'); 
    }

    static draw() {
        globals.bots.forEach(bot => {
            bot.draw();
        });
    }

    static move() {
        globals.bots.forEach(bot => {
            bot.move();
        });
    }

    static checkFoodCollisions() {
        globals.bots.forEach(bot => {
            for (let i = globals.food.length - 1; i >= 0; i--) {
                if (bot.eats(globals.food[i])) {
                    globals.food.splice(i, 1);
                }
            }
        });
    }

    static checkBotsCollisions() {
        for (let i = 0; i < globals.bots.length; i++) {
            for (let j = 0; j < globals.bots.length; j++) {
                if (i != j) {
                    if (globals.bots[i].eats(globals.bots[j])) {
                        globals.bots[j].alive = false;
                    }
                }
            }
        }

        for (let i = globals.bots.length - 1; i >= 0; i--) {
            if (!globals.bots[i].alive) {
                globals.bots.splice(i, 1);
            }
        }
    }

    static checkPlayerCollisions() {
        globals.bots.forEach(bot => {
            if (bot.eats(globals.player)) {
                globals.player.alive = false;
                loseHandler();
            }
        });
    }
}