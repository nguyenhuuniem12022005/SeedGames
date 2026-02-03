import { Game } from "./Game.js";

export class Snake {

    static COLOR = 0x00ff00;

    constructor(scene) {
        this.scene = scene;
        this.body = [];
        this.direction = this.nextDirection = Phaser.Utils.Array.GetRandom([
            Phaser.Math.Vector2.UP,   Phaser.Math.Vector2.RIGHT,
            Phaser.Math.Vector2.DOWN, Phaser.Math.Vector2.LEFT
        ]);
        this.reset();
    }

    reset() {
        const head = new Phaser.GameObjects.Rectangle(
            this.scene,
            Phaser.Math.Between(1, Game.GRID_SIZE - 2),
            Phaser.Math.Between(1, Game.GRID_SIZE - 2),
            1, 1, Snake.COLOR
        );
        const tail = new Phaser.GameObjects.Rectangle(
            this.scene,
            head.x - this.direction.x,
            head.y - this.direction.y,
            1, 1, Snake.COLOR
        );

        for (const segment of this.body) {
            segment.destroy();
        }
        this.body = [tail, head];
        for (const segment of this.body) {
            segment.setOrigin(0, 0);
            this.scene.add.existing(segment);
        }
    }

    getHead() {
        return this.body[this.body.length - 1];
    }

    getBody() {
        return this.body;
    }

    setNextDirection(nextDirection) {
        this.nextDirection = nextDirection;
    }

    shrink() {
        this.body[0].destroy();
        this.body.shift();
    }

    grow() {
        if (this.direction.x !== -this.nextDirection.x || this.direction.y !== -this.nextDirection.y) {
            this.direction = this.nextDirection;
        }

        const newHead = new Phaser.GameObjects.Rectangle(
            this.scene,
            Phaser.Math.Wrap(this.getHead().x + this.direction.x, 0, Game.GRID_SIZE),
            Phaser.Math.Wrap(this.getHead().y + this.direction.y, 0, Game.GRID_SIZE),
            1, 1,
            Snake.COLOR
        );

        newHead.setOrigin(0, 0);
        this.scene.add.existing(newHead);
        this.body.push(newHead);
    }

}