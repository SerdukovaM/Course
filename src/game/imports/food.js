
import { Circle } from "./circle.js";
import { globals } from "./globals.js";
import { getRandomInt } from "./utils.js"

export class Food extends Circle {
    constructor(positionX, positionY, radius, color, strokeColor) {
        super(positionX, positionY, radius, color, strokeColor);
    }

    static spawn() {
        for (let i = 0; i < globals.config.food.amount; i++) {
            globals.food.push(new Food(
                getRandomInt(-globals.config.world.width / 2 + globals.config.food.radius, globals.config.world.width / 2 - globals.config.food.radius),
                getRandomInt(-globals.config.world.height / 2 + globals.config.food.radius, globals.config.world.height / 2 - globals.config.food.radius),
                globals.config.food.radius,
                globals.config.food.color,
                globals.config.food.strokeColor
            ));
        }
    }

    static respawn() {
        while (globals.food.length < globals.config.food.amount) {
            globals.food.push(new Food(
                getRandomInt(-globals.config.world.width / 2 + globals.config.food.radius, globals.config.world.width / 2 - globals.config.food.radius),
                getRandomInt(-globals.config.world.height / 2 + globals.config.food.radius, globals.config.world.height / 2 - globals.config.food.radius),
                globals.config.food.radius,
                globals.config.food.color,
                globals.config.food.strokeColor
            ));
        }
    }

    static draw() {
        globals.food.forEach(food => {
            food.draw();
        });
    }
}