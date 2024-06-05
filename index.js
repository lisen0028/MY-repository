const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
//从储存中获得最高纪录
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `最高得分: ${highScore}`;
//随机传递一个1到30之间的数字 食物随机刷一个位置
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("kkk死了吧，按确定重新开始");
    location.reload();//刷新页面重来
}

//基于key press改变方向
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

//改变方向
controls.forEach(
    button => button.addEventListener("click", () =>
        changeDirection({ key: button.dataset.key })));



const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //当蛇头碰到食物时，score增加1，food的位置改变
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;

    }
    //更新蛇头
    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        //更新蛇身体
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];


    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        //当蛇头碰到自己时，游戏结束
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] &&
            snakeBody[0][0] === snakeBody[i][0]) {
            //当蛇头碰到自己时，游戏结束
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}


updateFoodPosition();
const speed = 150;
if (score >= 10)
    speed = 100;
setIntervalId = setInterval(initGame, speed);
document.addEventListener("keyup", changeDirection);