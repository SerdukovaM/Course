
import { globals } from "./globals.js";

export class Canvas {
    static create() {
        if (!globals.canvas) {
            globals.canvas = document.createElement('canvas');
            globals.canvas.addEventListener('mousemove', (event) => {
                globals.mouseX = event.pageX - globals.canvas.width / 2;
                globals.mouseY = event.pageY - globals.canvas.height / 2;
            });
            globals.ctx = globals.canvas.getContext('2d');
            document.body.appendChild(globals.canvas);
        }
    }

    static resize() {
        globals.canvas.width = window.innerWidth;
        globals.canvas.height = window.innerHeight;
    }
    
    static load() {
        Canvas.create();
        Canvas.resize();
        window.addEventListener('resize', Canvas.resize);
    }

    static draw() {
        globals.ctx.beginPath();
        globals.ctx.fillStyle = globals.config.world.secondaryColor;
        globals.ctx.fillRect(
            -globals.config.world.width / 2 * 3, 
            -globals.config.world.height / 2 * 3, 
            globals.config.world.width * 3, 
            globals.config.world.height * 3
        );
        globals.ctx.fillStyle = globals.config.world.color;
        globals.ctx.fillRect(
            -globals.config.world.width / 2, -globals.config.world.height / 2, globals.config.world.width, globals.config.world.height
        );
        globals.ctx.closePath();
    }

    static clear() {
        globals.ctx.clearRect(
             -globals.config.world.width / 2, -globals.config.world.height / 2, globals.config.world.width, globals.config.world.height
        );
    }

    static transform() {
        if (globals.player) {
            globals.ctx.setTransform(1, 0, 0, 1, 0, 0);
            globals.ctx.translate(globals.canvas.width / 2, globals.canvas.height / 2);
            globals.ctx.scale(globals.config.player.start.radius / globals.player.radius, globals.config.player.start.radius / globals.player.radius);
            globals.ctx.translate(-globals.player.position.x, -globals.player.position.y);
        }
    }
}