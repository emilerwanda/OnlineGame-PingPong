const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// 🎮 Game Constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// 🎯 Game State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// 🖱 Mouse movement for player control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// 🧠 Update game logic
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collisions
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballSpeedY *= -1;
    }

    // Player paddle collision
    if (
        ballX - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS;
        ballSpeedX *= -1;

        // Add "spin"
        const deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = BALL_SPEED * (deltaY / (PADDLE_HEIGHT / 2));
    }

    // AI paddle collision
    if (
        ballX + BALL_RADIUS > AI_X &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = AI_X - BALL_RADIUS;
        ballSpeedX *= -1;

        const deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = BALL_SPEED * (deltaY / (PADDLE_HEIGHT / 2));
    }

    // Scoring
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Simple AI movement
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 10) aiY += PADDLE_SPEED;
    else if (aiCenter > ballY + 10) aiY -= PADDLE_SPEED;

    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// 🧹 Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
}

// 🖼 Render everything
function draw() {
    // Background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Net
    ctx.setLineDash([12, 16]);
    ctx.strokeStyle = '#555';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = '#ff4d4d';
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#00f';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Scores
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(playerScore, canvas.width / 4, 50);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 50);
}

// 🕹 Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// 🚀 Start game
gameLoop();
