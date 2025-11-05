let inputDir = { x: 0, y: 0 };
let foodSound = new Audio("../music/food.mp3");
let gameOverSound = new Audio("../music/gameover.mp3");
let moveSound = new Audio("../music/move.mp3");
let musicSound = new Audio("../music/music.mp3");

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
  {
    x: 13,
    y: 15,
  },
];

let food = { x: 6, y: 7 };

// game function

// High Score logic
let hiscore = localStorage.getItem("hiscore");
let hiscoreval;

if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
}

document.getElementById("hiscoreBox").innerHTML = "Hi-Score:" + hiscoreval;

function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return;
  }

  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  // self buup
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  // if bump in wall
  if (
    snake[0].x >= 19 ||
    snake[0].x <= 0 ||
    snake[0].y >= 19 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  // update snake and food
  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    alert("Game Over. Press any key to restart!");
    snakeArr = [{ x: 13, y: 15 }];
    musicSound.play();
    score = 0;
    speed = 5; 
    scoreBox.innerHTML = "Score:" + score; 
  }

  // increase score and regenerate snake if food is eatedn
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;

    if (score % 5 === 0) {
      speed += 2;
      console.log("Speed increased! Current speed:", speed);
    }

    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      document.getElementById("hiscoreBox").innerHTML =
        "Hi-Score:" + hiscoreval;
    }

    scoreBox.innerHTML = "Score:" + score;
    snakeArr.unshift({
      x: snakeArr[0].x + inputDir.x,
      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2;
    let b = 16;
    food = {
      x: 2 + Math.round(a + (b - a) * Math.random()),
      y: 2 + Math.round(a + (b - a) * Math.random()),
    };
  }

  // moving snakke

  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  // display snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
    board.appendChild(snakeElement);
  });
  //  Display Food

  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  board.appendChild(foodElement);
}

// main logic

window.requestAnimationFrame(main);

window.addEventListener("keydown", (e) => {
  // inputDirection = { x: 0, y: 1 };
  moveSound.play();
  switch (e.key) {
    case "ArrowUp":
      if (inputDir.y !== 1) {
        inputDir.x = 0;
        inputDir.y = -1;
      }

      break;
    case "ArrowDown":
      if (inputDir.y !== -1) {
        inputDir.x = 0;
        inputDir.y = 1;
      }

      break;
    case "ArrowLeft":
      if (inputDir.x !== 1) {
        inputDir.x = -1;
        inputDir.y = 0;
      }
      break;
    case "ArrowRight":
      if (inputDir.x !== -1) {
        inputDir.x = 1;
        inputDir.y = 0;
      }
      break;
  }
});
