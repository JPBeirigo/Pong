const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw middle dashed line
    ctx.setLineDash([8, 8]);
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI*2);
    ctx.fill();

    // Draw Scores
    ctx.font = "36px Arial";
    ctx.fillText(playerScore, canvas.width/4, 50);
    ctx.fillText(aiScore, 3*canvas.width/4, 50);
}

// Update game state
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top/bottom wall collision
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballSpeedY *= -1;
    }
    if (ballY + BALL_RADIUS > canvas.height) {
        ballY = canvas.height - BALL_RADIUS;
        ballSpeedY *= -1;
    }

    // Left paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballSpeedX *= -1;
        // Add a bit of "english" based on where it hit the paddle
        let collidePoint = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Right paddle (AI) collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballSpeedX *= -1;
        let collidePoint = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Left/right wall (score)
    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 20) aiY += AI_SPEED;
    else if (aiCenter > ballY + 20) aiY -= AI_SPEED;

    // Clamp AI paddle
    if (aiY < 0) aiY = 0;
    if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    // Randomize serve direction and angle
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() * 2 - 1);
}

// Main loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();