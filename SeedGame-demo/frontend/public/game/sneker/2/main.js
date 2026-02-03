import { Game } from './Game.js';

const CONFIG = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: Game.GRID_SIZE,
    height: Game.GRID_SIZE,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Game]
};

const game = new Phaser.Game(CONFIG);
let gameScene;

// Notify parent window (for page.tsx communication)
function notify(type, payload) {
    window.parent.postMessage({ type, payload }, '*');
}

// Listen for code execution commands from parent (page.tsx)
window.addEventListener('message', (event) => {
    const { type, code, problemId } = event.data;
    
    if (type === 'run') {
        if (document.getElementById('status')) {
            document.getElementById('status').textContent = 'Running code...';
        }
        executeUserCode(code, problemId);
    }
});

// Execute user code from Monaco Editor
function executeUserCode(userCode, problemId) {
    try {
        notify('progress', 'Executing user code...');
        
        if (!gameScene || !gameScene.apple) {
            throw new Error('Game not ready');
        }

        // console.log('Received Code from Monaco Editor:\n', code);

        const code = `const head = this.snake.getHead();
        const body = this.snake.getBody();
        if (head.x === this.apple.x && head.y === this.apple.y) this.apple.reset();
        else this.snake.shrink();\n` + userCode;
        console.log('Submitted Code:\n', code);
        
        // Execute user's code - assign to apple.reset
        gameScene.apple.reset = new Function(code);
        
        if (document.getElementById('status')) {
            document.getElementById('status').textContent = 'Code executed ✓';
        }
        notify('success', 'Code injected into game successfully');

    } catch (error) {
        console.error('Error executing user code:', error);
        if (document.getElementById('status')) {
            document.getElementById('status').textContent = 'Error: ' + error.message;
        }
        notify('fail', error.message);
    }
}

// Get scene reference when game is ready
game.events.once('ready', () => {
    gameScene = game.scene.scenes[0];
    if (document.getElementById('status')) {
        document.getElementById('status').textContent = 'Ready';
    }
    notify('ready');
});