let canvas,
    canvasContext,
    interval,
    ballX = 400,
    ballY = 300,
    ballSpeedX = 12,
    ballSpeedY = 12;

let paddle1Y = 250,
    paddle2Y = 250
    player1Score = 0,
    player2Score = 0;

const AI_MOVING_SPEED = 10;
const BALL_RADIUS = 10;
const PADDING_HEIGHT = 100;
const PADDING_THICKNESS = 10;
const WINNING_SCORE = 3;

let showingWinScreen = false;
let showReadyScreen = true;
let framesPerSecond = 50;


window.onload = () => {
    canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext('2d');
    canvasContext.font = "30px Arial";
    canvasContext.textAlign = 'center';
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    centerColorText('Click to start the game!', canvas.height - 400, 'white');
    centerColorText('Move mouse to control the left paddle.', canvas.height - 300);


    canvas.addEventListener('mousemove', (e) => {
        let position = calculateMousePosition(e);
        paddle1Y = position.y - PADDING_HEIGHT / 2;
    })

    canvas.addEventListener('mousedown', handleMouseClick);
}

handleMouseClick = (ev) => {
    if (showingWinScreen) {
        player1Score = player2Score = 0;
        showingWinScreen = false;
        startGame();
    }

    if (showReadyScreen) {
        showReadyScreen = false;
        startGame();
    }
}

calculateMousePosition = (ev) => {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = ev.clientX - rect.left - root.scrollLeft;
    let mouseY = ev.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

playSound = () => {
    let sound = document.getElementById("soccer");
    sound.volume = 0.5;
    sound.load();
    sound.play();
}

resetBall = () => {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
        clearInterval(interval);
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    pauseGame(1000);
}

startGame = () => {
    clearInterval(interval);
    interval = setInterval(() => {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);
}

pauseGame = (ms) => {
    clearInterval(interval);
    setTimeout(() => {
        startGame();
    }, ms);
}

computerMove = () => {
    let center = paddle2Y + PADDING_HEIGHT / 2;
    let range = 35;
    if (center > ballY + range) paddle2Y -= AI_MOVING_SPEED;
    else if (center < ballY - range) paddle2Y += AI_MOVING_SPEED;
}

moveEverything = () => {
    if (showingWinScreen) {
        return;
    }
    computerMove();
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 + PADDING_THICKNESS + BALL_RADIUS / 2) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDING_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + PADDING_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
            playSound();
        } else {
            player2Score++;
            resetBall();
        }
    }
    if (ballX > canvas.width - PADDING_THICKNESS - BALL_RADIUS / 2) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDING_HEIGHT) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle2Y + PADDING_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35;
            playSound();
        } else {
            player1Score++;
            resetBall();
        }
    }
    if (ballY > canvas.height || ballY < 0) ballSpeedY = -ballSpeedY;
}

drawNet = () => {
    for (let i = 10; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

drawEverything = () => {
    //Draw background
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) {
        if (player1Score >= WINNING_SCORE) {
            centerColorText('You Won!!', 100, 'white');
        } else {
            centerColorText('Computer Won!', 100, 'white');
        }
        centerColorText('Click to continue', canvas.height - 200);
        return;
    }

    drawNet();
    //Draw left player paddle
    colorRect(0, paddle1Y, PADDING_THICKNESS, PADDING_HEIGHT, 'white');
    //Draw right AI player paddle
    colorRect(canvas.width - PADDING_THICKNESS, paddle2Y, PADDING_THICKNESS, PADDING_HEIGHT);
    //Draw the ball!
    colorCircle(ballX, ballY, BALL_RADIUS, 'red');

    colorText(player1Score, 50, 50, 'white');
    colorText(player2Score, canvas.width - 50, 50);
}

colorRect = (leftX, topY, width, height, drawColor) => {
    if (drawColor) canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

colorText = (text, x, y, drawColor) => {
    if (drawColor) canvasContext.fillStyle = drawColor;
    canvasContext.fillText(text, x, y);
}

centerColorText = (text, y, drawColor) => {
    colorText(text, canvas.width / 2, y, drawColor);
}

colorCircle = (centerX, centerY, radius, drawColor) => {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}