const canvas = document.getElementById('myCanvas');
if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');

    let startSwich = 0;

    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    let dis;

    const paddleHeight = 10;
    let paddleWidth;
    const paddleWidthMin = 30;
    const paddleWidthMax = 80;

    let paddleWidthCount;
    let paddleX;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 5;
    const brickColumnCount = 7;
    const brickWidth = 50;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 20;
    let brickOffsetLeft;

    let bricks = [];
    let c;
    let r;

    let score = 0;

    let lives = 3;

    const pauseCharactor = 'PUSH START BUTTON';
    const gameoverCharactor = 'GAME OVER';
    const cleraCharactor = 'YOU WIN';

    function paddleShift() {
        const shift = document.getElementById('paddleShift');

        if (shift.checked === true) {
            if (paddleWidth <= paddleWidthMin) {
                paddleWidthCount = 1;
            } else if (paddleWidth >= paddleWidthMax) {
                paddleWidthCount = 0
            }
            if (paddleWidthCount === 1) {
                paddleWidth++;
            } else {
                paddleWidth--;
            }

        } else {
            paddleWidth = 75;
        }
    }

    function addMode() {
        paddleShift();
    }

    function bricksReset() {
        for (c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (r = 0; r < brickRowCount; r++) {
                bricks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1
                };
            }
        }
    }

    function allReset() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.widht - paddleWidth) / 2;
        lives = 3;
        score = 0;
        bricksReset();
    }

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    //入力キー設定
    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }

    //マウス判定
    document.addEventListener('mousemove', mouseMoveHandler, false);

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    //あたり判定
    function collisionDetection() {
        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                    }
                }
            }
        }
    }

    function paddleDetection() {
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
                dis = x - (paddleX + paddleWidth / 2);
                dx = dis / 6;
            } else {
                lives--;
                if (!lives) {
                    startSwich = 0;

                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                }
            }
        }
        x += dx;
        y += dy;
    }

    //スコア
    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#09d';
        ctx.fillText('Score: ' + score, 8, 20);
    }

    function drawLives() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '09d';
        ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
    }


    //オブジェクト設定
    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#09D';
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = '#09d';
        ctx.fill();
        ctx.closePath;
    }

    function drawBricks() {
        brickOffsetLeft = (canvas.width - ((brickWidth + brickPadding) * brickColumnCount)) / 2;

        for (c = 0; c < brickColumnCount; c++) {
            for (r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {

                    let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                    let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = '#09D';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }


    //画面表示
    bricksReset();


    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const start = document.getElementById('start');
        const pause = document.getElementById('pause');
        const reset = document.getElementById('reset');
        start.onclick = () => {
            startSwich = 1;
        }
        pause.onclick = () => {
            startSwich = 0;
        }
        reset.onclick = () => {
            allReset();
        }

        if (startSwich === 1) {

            addMode();
            drawBricks();
            drawBall();
            drawPaddle();
            collisionDetection();
            drawScore();
            drawLives();
            paddleDetection();


            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }


            if (score === brickRowCount * brickColumnCount) {
                startSwich = 3;
            }
        } else if (startSwich === 0) {
            if (lives === 0) {
                ctx.font = '30px Arial';
                ctx.fillStyle = '#09d';
                ctx.fillText(gameoverCharactor, (canvas.width - ctx.measureText(gameoverCharactor).width) / 2, canvas.height / 2 + 15);
                bricksReset();

            } else {

                ctx.font = '30px Arial';
                ctx.fillStyle = '#09d';
                ctx.fillText(pauseCharactor, (canvas.width - ctx.measureText(pauseCharactor).width) / 2, canvas.height / 2 + 15);
            }
        } else if (startSwich === 3) {
            ctx.font = '30px Arial';
            ctx.fillStyle = '#09d';
            ctx.fillText(cleraCharactor, (canvas.width - ctx.measureText(cleraCharactor).width) / 2, canvas.height / 2 + 15);
            start.onclick = () => {
                startSwich = 1;
                allReset();
            }
        }
    }



    //ループ関数呼び出し
    setInterval(draw, 10);

} else {
    console.log('失敗');
}