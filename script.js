const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const pauseButton = document.getElementById('pauseButton');
const upButton = document.getElementById('up');
const leftButton = document.getElementById('left');
const downButton = document.getElementById('down');
const rightButton = document.getElementById('right');

const grid = 16; // Size of each grid cell
let count = 0; // Game loop counter
let score = 0;
let isPaused = false;

const snake = {
    x: 160,
    y: 160,
    dx: grid, // Snake's horizontal speed
    dy: 0,    // Snake's vertical speed
    cells: [],
    maxCells: 4 // Initial length of the snake
};

const food = {
    x: 320,
    y: 320
};

// Game loop
function gameLoop() {
    requestAnimationFrame(gameLoop);

    // Limit frame rate
    if (++count < 8) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (!isPaused) {
        moveSnake();
    }
    drawFood();
    drawSnake();
    drawScore();
}

function moveSnake() {
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Keep track of where snake has been. Front of the array is always the head.
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Remove cells as we move away from them.
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Check for collision with walls
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        resetGame();
    }

    // Check for collision with food
    if (snake.x === food.x && snake.y === food.y) {
        snake.maxCells++;
        score++;
        placeFood();
    }

    // Check for collision with self
    for (let i = 1; i < snake.cells.length; i++) {
        if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
            resetGame();
        }
    }
}

function drawSnake() {
    context.fillStyle = 'green';
    snake.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    });
}

function drawFood() {
    context.fillStyle = 'red';
    context.fillRect(food.x, food.y, grid - 1, grid - 1);
}

function drawScore() {
    scoreDisplay.textContent = '分数: ' + score;
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / grid)) * grid;
    food.y = Math.floor(Math.random() * (canvas.height / grid)) * grid;
}

function resetGame() {
    snake.x = 160;
    snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid;
    snake.dy = 0;
    score = 0;
    isPaused = false;
    pauseButton.textContent = '暂停';
    placeFood();
    drawScore();
}

// Keyboard controls
document.addEventListener('keydown', function(e) {
    // Left arrow key
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Up arrow key
    else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Right arrow key
    else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Down arrow key
    else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// Pause button event listener
pauseButton.addEventListener('click', function() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '继续' : '暂停';
});

// On-screen controls event listeners
upButton.addEventListener('click', function() {
    if (snake.dy === 0 && !isPaused) {
        snake.dy = -grid;
        snake.dx = 0;
    }
});

leftButton.addEventListener('click', function() {
    if (snake.dx === 0 && !isPaused) {
        snake.dx = -grid;
        snake.dy = 0;
    }
});

downButton.addEventListener('click', function() {
    if (snake.dy === 0 && !isPaused) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

rightButton.addEventListener('click', function() {
    if (snake.dx === 0 && !isPaused) {
        snake.dx = grid;
        snake.dy = 0;
    }
});

// Start the game
placeFood();
requestAnimationFrame(gameLoop);