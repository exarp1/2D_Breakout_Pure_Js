// JavaScript code goes here
// Grab reference to the canvas for scripting
var canvas							= document.getElementById("myCanvas");
var ctx									= canvas.getContext("2d");
var ballRadius					= 10;
var x										= canvas.width / 2;
var y										= canvas.height - 30;
var dx									= 2;
var dy									= -2;
var c										= 0;
var r										= 0;
var color								= "#FFAA00";
var paddleHeight				= 10;
var paddleWidth					= 75;
var paddleX							= (canvas.width - paddleWidth) / 2;
var rightPressed				= false;
var leftPressed					= false;

// Brick information
var brickRowCount 			= 3;
var brickColumnCount 		= 5;
var brickWidth 					= 75;
var brickHeight 				= 20;
var brickPadding 				= 10;
var brickOffsetTop 			= 30;
var brickOffsetLeft 		= 30;
var score								= 0;
var lives								= 3;

// Create the set of bricks we will draw.
var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, status: 1, y: 0 };
	}
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = true;
	} else if(e.keyCode == 37) {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if(e.keyCode == 39) {
		rightPressed = false;
	} else if(e.keyCode == 37) {
		leftPressed = false;
	}
}

// Deal with mouse input
function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

// collision detect for our bricks.
function collisionDetection() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				//calculations
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy; 

					// reset status
					b.status = 0;
					score++;
					if (score == brickRowCount * brickColumnCount) {
						alert("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
}


// Draw a ball 
function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

// Draw bricks
function drawBricks() {
	var c = 0;
	var r = 0;
	var brickX = 0;
	var brickY = 0;
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if(bricks[c][r].status == 1) {
				brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				// initialize to (0,0)
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = '#0095DD';
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
// draw the score
function drawScore() {
	ctx.font = '16px Arial';
	ctx.fillstyle = '#0095dd';
	ctx.fillText('Score: ' + score, 8, 20);
}

// deal with lives
function drawLives() {
	ctx.font = '16px Arial';
	ctx.fillStyle = '#0095dd';
	ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// change color on impact
function changeColor() {
	var min = Math.ceil(0x00);
	var max = Math.floor(0xFF);
	var r = Number(Math.floor(Math.random() * (max - min)) + min).toString(16);
	var g = Number(Math.floor(Math.random() * (max - min)) + min).toString(16);
	var b = Number(Math.floor(Math.random() * (max - min)) + min).toString(16);
	return "#" + r + g + b;
}

// Keep animated ball from leaving our canvas 'box'
function collisionDetect(color) {

	// Reverse X-Axis direction if we hit right/left edge of our canvas 'box'
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
		changeColor(color);
	}

	// Reverse Y-Axis direction if we hit top/bottom edge of our canvas 'box'
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if(y + dy > canvas.height-ballRadius) {
		if(x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if(!lives) {
				alert("GAME OVER");
				document.location.reload();
			} else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = 3;
				dy = -3;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
}


// Animate the ball - yay!
// clear canvas before each redraw 
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();
	collisionDetect(color);
	if(rightPressed && paddleX < canvas.width-paddleWidth) {
		paddleX += 7;
	} else if(leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	// Move the ball accordingly
	x += dx;
	y += dy;
	requestAnimationFrame(draw);
}

draw();
