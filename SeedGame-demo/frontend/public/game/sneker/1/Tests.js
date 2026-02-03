class TestInterface {
    check(game) {}
}

export class AppleEatTest extends TestInterface {

    #snakeSize  = -1;
    #applePrevX = -1;
    #applePrevY = -1;

    check(game) {
        const snakeSize = game.snake.getBody().length;
        if (this.#snakeSize === snakeSize) {
            return;
        }
        
        const apple = game.apple;
        const isFirstCheck = this.#snakeSize === -1;
        this.#snakeSize = snakeSize;
        
        if (isFirstCheck) {
            this.#applePrevX = apple.x;
            this.#applePrevY = apple.y;
            return;
        }
        
        const appleChanged = apple.x !== this.#applePrevX || apple.y !== this.#applePrevY;
        console.log(`AppleEatTest: ${appleChanged}`);
    }

}