import { Snake } from './Snake.js';
import { Apple } from './Apple.js';

export class Game extends Phaser.Scene {
    
    static GRID_SIZE = 30;

    constructor() {
        super('Game');
    }

    create() {
        this.time = 0;
        this.snake = new Snake(this);
        this.apple = new Apple(this, this.snake.getBody());
        
        this.handleCollisions = function() {
            const head = this.snake.getHead();
            const body = this.snake.getBody();
            if (head.x === this.apple.x && head.y === this.apple.y) this.apple.reset();
            else this.snake.shrink();
        };
        
        const keys = this.input.keyboard.createCursorKeys();
        this.inputs = [
            [keys.up,    Phaser.Math.Vector2.UP],
            [keys.right, Phaser.Math.Vector2.RIGHT],
            [keys.down,  Phaser.Math.Vector2.DOWN],
            [keys.left,  Phaser.Math.Vector2.LEFT]
        ];
    }

    update(time) {
        // document.getElementById('submit-button').addEventListener('click', () => {
        //     const userCode = this.codeEditor.getEditableCode();
        //     const code = `const head = this.snake.getHead();
        //     const body = this.snake.getBody();
        //     if (head.x === this.apple.x && head.y === this.apple.y) this.apple.reset();
        //     else this.snake.shrink();\n` + userCode;
        //     console.log('Submitted Code:\n', code);
        //     this.handleCollisions = new Function(code);
        // });

        this.handleInput();
        if (this.shouldUpdate(time)) {
            this.snake.grow();
            this.handleCollisions();
        }
    }


    handleInput() {
        for (const [key, direction] of this.inputs) {
            if (Phaser.Input.Keyboard.JustDown(key)) {
                this.snake.setNextDirection(direction);
            }
        }
    }

    handleCollisions() {
        const head = this.snake.getHead();
        const body = this.snake.getBody();

        // avoid tails and head collisions
        for (let i = 1; i < body.length - 1; ++i) {
            if (body[i].x === head.x && body[i].y === head.y) {
                this.snake.reset();
                this.apple.reset();
                return;
            }
        }

        if (head.x === this.apple.x && head.y === this.apple.y) {
            this.apple.reset();
        } else {
            this.snake.shrink();
        }
    }

    shouldUpdate(time) {
        const INTERVAL = 150; // milliseconds
        if (time - this.time >= INTERVAL) {
            this.time = time;
            return true;
        }
        return false;
    }

}
