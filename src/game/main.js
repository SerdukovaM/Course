
import { globals } from "./imports/globals.js";
import { stopwatchUpdate } from "./imports/utils.js";
import { Config } from "./imports/config.js";
import { Canvas } from "./imports/canvas.js";
import { Player } from "./imports/player.js";
import { Bot } from "./imports/bot.js";
import { Food } from "./imports/food.js";

function setup() {
    Config.load();
    Canvas.load();
    Player.create();
    Bot.spawn();
    Food.spawn();

    globals.foodRespawnTimer = setInterval(Food.respawn, globals.config.food.respawnTimer);
    globals.stopwatchTimer = setInterval(stopwatchUpdate, globals.config.game.stopwatchTimer);
}

function draw() {
    Canvas.clear();
    Canvas.transform();
    Canvas.draw();
    Food.draw();
    Bot.draw();
    Player.draw();
}

function update() {
    draw();
    Player.move();
    Player.checkFoodCollisions();
    Player.checkBotsCollisions();
    Bot.move();
    Bot.checkFoodCollisions();
    Bot.checkBotsCollisions();
    Bot.checkPlayerCollisions();
    globals.animationFrameTimer = window.requestAnimationFrame(update);
}

function run() {
    setup();
    update();
}

run();