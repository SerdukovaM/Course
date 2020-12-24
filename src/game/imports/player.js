
import { Circle } from "./circle.js";
import { globals } from "./globals.js";
import { winHandler } from "./utils.js";

const Vector = require('victor');
const { ipcRenderer } = require('electron');

export class Player extends Circle {
    constructor(positionX, positionY, radius, color, strokeColor, nickname) {
        super(positionX, positionY, radius, color, strokeColor);
        this.nickname = nickname;
        this.alive = true;
    }

    draw() {
        super.draw();
        this.drawNickname();
    }

    drawNickname() {
        let fontSize = Math.round(this.radius / 3);
        globals.ctx.font = `${fontSize}px serif`;
        let textMetrics = globals.ctx.measureText(this.nickname);
        globals.ctx.fillStyle = globals.config.player.nicknameColor;
        globals.ctx.fillText(this.nickname, this.position.x - Math.round(textMetrics.width / 2), this.position.y + Math.round(fontSize / 4));
    }

    move() {
        let velocity = new Vector(globals.mouseX, globals.mouseY);
        velocity.norm().multiplyScalar(2);
        this.position.add(velocity);
        this.checkBoundaries();
    }

    checkBoundaries() {
        const t = -globals.config.world.height / 2;
        const r = globals.config.world.width / 2;
        const b = globals.config.world.height / 2;
        const l = -globals.config.world.width / 2;

        if (this.position.y - this.radius < t) {
            this.position.y = t + this.radius;
        } else if (this.position.y + this.radius > b) {
            this.position.y = b - this.radius;
        }

        if (this.position.x - this.radius < l) {
            this.position.x = l + this.radius;
        } else if (this.position.x + this.radius > r) {
            this.position.x = r - this.radius;
        }
    }

    eats(other) {
        if (globals.player && globals.player.alive) {
            if (this.radius > other.radius * 1.1) {
                if (this.position.distance(other.position) < this.radius) {
                    let totalArea = Math.PI * this.radius * this.radius + Math.PI * other.radius * other.radius;
                    this.radius = Math.round(Math.sqrt(totalArea / Math.PI));
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    static async create() {
        if (!globals.player) {
            globals.player = new Player(
                globals.config.player.start.positionX,
                globals.config.player.start.positionY,
                globals.config.player.start.radius,
                globals.config.player.color,
                globals.config.player.strokeColor,
                await ipcRenderer.invoke('getStoreValue', 'nickname')
            );
        }
    }

    static draw() {
        if (globals.player && globals.player.alive == true) {
            globals.player.draw();
        }
    }

    static move() {
        if (globals.player && globals.player.alive && globals.bots.length > 0) {
            globals.player.move();
        }
    }

    static checkFoodCollisions() {
        if (globals.player && globals.player.alive) {
            if (globals.food.length > 0) {
                for (let i = globals.food.length - 1; i >= 0; i--) {
                    if (globals.player.eats(globals.food[i])) {
                        globals.food.splice(i, 1);
                    }
                }
            }
        }
    }

    static checkBotsCollisions() {
        if (globals.player && globals.player.alive) {
            if (globals.bots.length > 0) {
                for (let i = globals.bots.length - 1; i >= 0; i--) {
                    if (globals.player.eats(globals.bots[i])) {
                        globals.bots.splice(i, 1);
                        if (globals.bots.length == 0) {
                            winHandler();
                        }
                    }
                }
            }
        }
    }
}