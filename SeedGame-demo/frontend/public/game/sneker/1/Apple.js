import { Game } from './Game.js';

export class Apple extends Phaser.GameObjects.Rectangle {

    static COLOR = 0xff0000;

    constructor(scene, snakeBody) {
        super(scene, 0, 0, 1, 1, Apple.COLOR);
        this.snakeBody = snakeBody;
        this.setOrigin(0, 0);
        this.reset();
        scene.add.existing(this);
    }

    reset() {
        let x = this.x, y = this.y;
        do {
            x = Math.floor(Math.random() * 30);
            y = Math.floor(Math.random() * 30);
        } while (this.snakeBody.some(segment => segment.x === x && segment.y === y));
        this.setPosition(x, y);
    } // New

}