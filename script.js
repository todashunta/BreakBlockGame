const canvas = document.getElementById('myCanvas');
if (canvas.getContext('2d')) {
    const ctx = canvas.getContext('2d');

    let startSwich = 0;

    const setBallRadius = 10;
    let ballRadius;
    const ballRadiusMin = 5;
    const ballRadiusMax = 30;
    let ballRadiusCount;

    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;
    let dis;

    const paddleHeight = 10;
    let paddleWidth;
    const setPaddleWidth = 75;
    const paddleWidthMin = 30;
    const paddleWidthMax = 80;

    let paddleWidthCount;
    let paddleX;

    let rightPressed = false;
    let leftPressed = false;
    let sPressed = false;
    let pPressed = false;
    let rPressed = false;

    let blockRowCount;
    let blockColumnCount = 5;
    const blockWidth = 50;
    const blockHeight = 20;
    const blockPadding = 10;
    const blockOffsetTop = 20;
    let blockOffsetLeft;

    let blocks = [];
    let c;
    let r;

    let score = 0;

    let lives = 3;

    const pauseChar = 'PUSH START BUTTON';
    const gameoverChar = 'GAME OVER';
    const clearChar = 'YOU WIN';

    const start = document.getElementById('start');
    const pause = document.getElementById('pause');
    const reset = document.getElementById('reset');

    const blocksArray = document.getElementById('blocksOption');
    const blockRow = document.getElementById('row');
    const blockColumn = document.getElementById('column');

    const speedRange = document.getElementById('speedRange');

    blockRowCount = blockRow.value;
    blockColumnCount = blockColumn.value;

    //メニュー・CSS設定
    function menu() {
        const menu = document.getElementById('menu').style;
        menu.display = 'none';
    }

    //パドルの長さ
    function paddleShift() {
        const shift = document.getElementById('paddleShift');

        if (shift.checked === true) {
            if (paddleWidth <= paddleWidthMin) {
                paddleWidthCount = true;
            } else if (paddleWidth >= paddleWidthMax) {
                paddleWidthCount = false
            }
            if (paddleWidthCount === true) {
                paddleWidth++;
                paddleX -= 0.5;
            } else {
                paddleWidth--;
                paddleX += 0.5;
            }

        } else {
            paddleWidth = setPaddleWidth;
        }
    }
    //ボールの大きさ
    function ballShift() {
        const shift = document.getElementById('ballShift');

        if (shift.checked === true) {
            if (ballRadius <= ballRadiusMin) {
                ballRadiusCount = true;
            } else if (ballRadius >= ballRadiusMax) {
                ballRadiusCount = false;
            }
            if (ballRadiusCount === true) {
                ballRadius += 0.1;
            } else {
                ballRadius -= 0.1;
            }
        } else {
            ballRadius = setBallRadius;
        }
    }

    function addMode() {
        paddleShift();
        ballShift();
    }

    //ブロックリセット
    function blocksReset() {
        for (c = 0; c < blockColumnCount; c++) {
            blocks[c] = [];
            for (r = 0; r < blockRowCount; r++) {
                blocks[c][r] = {
                    x: 0,
                    y: 0,
                    status: 1
                };
            }
        }
    }
    //オールリセット
    function allReset() {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.widht - paddleWidth) / 2;
        lives = 3;
        score = 0;
        blocksReset();
        start.disabled = false;
        pause.disabled = false;
        reset.disabled = false;
    }

    //入力キー設定

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        } else if (e.key === 'p') {
            pPressed = true;
            buttonPressed();
        } else if (e.key === 's') {
            sPressed = true;
            buttonPressed();
        } else if (e.key === 'r') {
            rPressed = true;
            buttonPressed();
        }
    }

    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        } else if (e.key === 'p') {
            pPressed = false;
        } else if (e.key === 's') {
            sPressed = false;
        } else if (e.key === 'r') {
            rPressed = false;
        }
    }
    //ボタン設定
    function buttonPressed() {
        if (sPressed === true) {
            startSwich = 1;
        } else if (pPressed === true) {
            startSwich = 0;
        } else if (rPressed === true) {
            allReset();
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

    //ブロックあたり判定
    function collisionDetection() {
        for (c = 0; c < blockColumnCount; c++) {
            for (r = 0; r < blockRowCount; r++) {
                let b = blocks[c][r];
                if (b.status === 1) {
                    if (x + ballRadius > b.x && x - ballRadius < b.x + blockWidth && y + ballRadius > b.y && y - ballRadius < b.y + blockHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                    }
                }
            }
        }
    }
    //パドルあたり判定
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
        x += dx * speedRange.value;
        y += dy * speedRange.value;
    }

    //スコア・ライフ
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

    function drawBlocks() {
        blockOffsetLeft = (canvas.width - ((blockWidth + blockPadding) * blockColumnCount)) / 2;

        for (c = 0; c < blockColumnCount; c++) {
            for (r = 0; r < blockRowCount; r++) {
                if (blocks[c][r].status === 1) {

                    let blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
                    let blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;

                    blocks[c][r].x = blockX;
                    blocks[c][r].y = blockY;
                    ctx.beginPath();
                    ctx.rect(blockX, blockY, blockWidth, blockHeight);
                    ctx.fillStyle = '#09D';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    //キャンバスの文字列設定
    function canvasChar(char) {
        ctx.font = '30px Arial';
        ctx.fillStyle = '#09d';
        ctx.fillText(char, (canvas.width - ctx.measureText(char).width) / 2, canvas.height / 2 + 15);
    }


    //ブロック表示
    blocksReset();

    //メイン関数・ループ関数
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        start.onclick = () => {
            startSwich = 1;
        }
        pause.onclick = () => {
            startSwich = 0;
        }
        reset.onclick = () => {
            allReset();
        }
        blocksArray.onclick = () => {
            blockRowCount = blockRow.value;
            blockColumnCount = blockColumn.value;
            allReset();
        }

        document.getElementById('rangeChar').innerText = speedRange.value;

        if (startSwich === 1) {

            addMode();
            drawBlocks();
            drawBall();
            drawPaddle();
            collisionDetection();
            drawScore();
            drawLives();
            paddleDetection();
            buttonPressed();
            menu();

            if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
            } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
            }

            if (score === blockRowCount * blockColumnCount) {
                startSwich = 3;
            }
        } else if (startSwich === 0) {
            if (lives === 0) {
                canvasChar(gameoverChar);
                start.disabled = true;
                setTimeout(() => {
                    allReset();
                }, 1000);
            } else {
                canvasChar(pauseChar);
            }
        } else if (startSwich === 3) {
            canvasChar(clearChar);
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