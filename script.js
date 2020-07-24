const canvas = document.getElementById('myCanvas');
if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');

    const ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    const paddleHeight = 10;
    let paddleWidth = 75;
    let paddleWidthCount;
    let paddleX = (canvas.width - paddleWidth) / 2;
    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    let score = 0;

    let lives = 3;

    function paddleShift() {
        const shift = document.getElementById('paddleShift');
        const widthMin = 30;
        const widthMax = 80;
        if (shift.checked === true) {
            if (paddleWidth <= widthMin) {
                paddleWidthCount = 1;
            } else if (paddleWidth >= widthMax) {
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


    let bricks = [];

    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = {
                x: 0,
                y: 0,
                status: 1
            };
        }
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
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score === brickRowCount * brickColumnCount) {
                            alert('YOU WIN, CONGRATUKATIONS!');
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }

    //スコア
    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#09d';
        ctx.fillText('Score: ' + score, 8, 20)
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
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
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
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        addMode();
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        drawScore();
        drawLives();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                if (!lives) {
                    document.location.reload();
                    alert('GAMW OVER');

                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.widht - paddleWidth) / 2;
                }
            }
        }


        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;
    }



    //ループ関数呼び出し
    setInterval(draw, 10);

} else {
    console.log('失敗');
}