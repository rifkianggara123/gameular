let snake;
let food;
let box = 25;
let direction;
let gameOver = false;
let nextDirection;
let tongueOut = false;

function setup() {
    createCanvas(400, 400);
    frameRate(10);
    resetGame();
    createButtons();
}

function draw() {
    drawGrid();
    if (gameOver) {
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Game Over! Press R or Restart", width / 2, height / 2);
        return;
    }
    drawFood();
    drawSnake();
    moveSnake();
}

function drawGrid() {
    for (let x = 0; x < width; x += box) {
        for (let y = 0; y < height; y += box) {
            fill((x / box + y / box) % 2 === 0 ? color(190, 240, 120) : color(160, 220, 100));
            noStroke();
            rect(x, y, box, box);
        }
    }
}

function drawFood() {
    fill(255, 255, 255, 100);
    ellipse(food.x + box / 2, food.y + box / 2, box * 1.5, box * 1.5);
    fill(255, 0, 0);
    ellipse(food.x + box / 2, food.y + box / 2, box, box);
    
    fill(34, 139, 34);
    rect(food.x + box / 2.5, food.y - 5, 5, 10);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        fill(color(`hsl(${(i * 30) % 360}, 100%, 50%)`));
        stroke(0);
        strokeWeight(2);
        rect(snake[i].x, snake[i].y, box, box, 5);
        noStroke();
        if (i === 0) {
            fill(255);
            ellipse(snake[i].x + 8, snake[i].y + 8, 6, 6);
            ellipse(snake[i].x + 18, snake[i].y + 8, 6, 6);
            fill(0);
            ellipse(snake[i].x + 8 + directionOffset().x, snake[i].y + 8 + directionOffset().y, 3, 3);
            ellipse(snake[i].x + 18 + directionOffset().x, snake[i].y + 8 + directionOffset().y, 3, 3);
            
            if (tongueOut) {
                fill(255, 0, 0);
                let tongueX = snake[i].x + 13 + directionOffset().x * 6;
                let tongueY = snake[i].y + 13 + directionOffset().y * 6;
                rect(tongueX, tongueY, 4, 12);
            }
        }
    }
}

function directionOffset() {
    let offset = { x: 0, y: 0 };
    if (direction === 'LEFT') offset.x = -2;
    if (direction === 'RIGHT') offset.x = 2;
    if (direction === 'UP') offset.y = -2;
    if (direction === 'DOWN') offset.y = 2;
    return offset;
}

function moveSnake() {
    if (nextDirection) {
        direction = nextDirection;
    }

    let head = snake[0].copy();
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'DOWN') head.y += box;

    if (dist(head.x, head.y, food.x, food.y) < box * 1.5) {
        tongueOut = true;
    } else {
        tongueOut = false;
    }

    if (head.x === food.x && head.y === food.y) {
        food = createVector(floor(random(width / box)) * box, floor(random(height / box)) * box);
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || collide(head)) {
        gameOver = true;
        shakeScreen();
        noLoop();
    }

    snake.unshift(head);
}

function shakeScreen() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            translate(random(-5, 5), random(-5, 5));
        }, i * 50);
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW && direction !== 'RIGHT') nextDirection = 'LEFT';
    if (keyCode === UP_ARROW && direction !== 'DOWN') nextDirection = 'UP';
    if (keyCode === RIGHT_ARROW && direction !== 'LEFT') nextDirection = 'RIGHT';
    if (keyCode === DOWN_ARROW && direction !== 'UP') nextDirection = 'DOWN';
    
    if ((key === 'R' || key === 'r') && gameOver) {
        resetGame();
    }
}

function collide(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

function resetGame() {
    snake = [createVector(10 * box, 10 * box)];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    food = createVector(floor(random(width / box)) * box, floor(random(height / box)) * box);
    gameOver = false;
    tongueOut = false;
    loop();
}

function createButtons() {
    let btnUp = createButton('↑');
    btnUp.position(450, 360);
    btnUp.mousePressed(() => { if (direction !== 'DOWN') nextDirection = 'UP'; });
    
    let btnLeft = createButton('←');
    btnLeft.position(420, 390);
    btnLeft.mousePressed(() => { if (direction !== 'RIGHT') nextDirection = 'LEFT'; });
    
    let btnRight = createButton('→');
    btnRight.position(480, 390);
    btnRight.mousePressed(() => { if (direction !== 'LEFT') nextDirection = 'RIGHT'; });
    
    let btnDown = createButton('↓');
    btnDown.position(450, 420);
    btnDown.mousePressed(() => { if (direction !== 'UP') nextDirection = 'DOWN'; });
    
    let btnRestart = createButton('Restart');
    btnRestart.position(450, 460);
    btnRestart.mousePressed(resetGame);
}
