
import { globals } from "./globals.js";

const Vector = require('victor');

export class Circle {
    constructor(positionX, positionY, radius, color, strokeColor) {
        this.position = new Vector(positionX, positionY);
        this.radius = radius;
        this.color = color;
        this.strokeColor = strokeColor;
    }

    draw() {
        globals.ctx.beginPath();
        globals.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        globals.ctx.fillStyle = this.color;
        globals.ctx.fill();
        globals.ctx.strokeStyle = this.strokeColor;
        globals.ctx.stroke();
        globals.ctx.closePath();
    }
}