class Player {
  div;
  x;
  y;
  isMoving;

  constructor(div) {
    this.div = div;
    this.isMoving = false;
  }
}

class Enemy {
  div;
  x;
  y;
  isIn;
  isRemoved;
  isClear;
  isBoss;
  blood;
  constructor(div) {
    this.div = div;
    //this.y = 0;
    this.isRemoved = false;
    this.isClear = false;
    this.isBoss = false;
    this.blood = 1;
  }
}

class Barrier {
  div;
  x;
  y;

  constructor(div) {
    this.div = div;
  }
}

const continer = document.getElementById("continer");

const player = new Player(document.getElementById("player"));
// const enemy = new Enemy(document.createElement("div"));

let bossBlood = document.getElementById("boss-blood");

const width = 800;
const height = 700;

let enemyList = [];
let timeOutList = [];

let isGameOver = false;
let isPlayAgain = false;

let enemyInterval;

let difficulty = 0; //easy
enemyTime = 1000;

let score = document.getElementById("score");
let totalHits = 0;
score.innerHTML = "Score: " + totalHits;

let misses = document.getElementById("misses");
let totalMisses = 10;
misses.innerHTML = "You: " + totalMisses + "/10";

// Barriers for the game
let barrier1 = new Barrier(document.createElement("div"));
let barrier2 = new Barrier(document.createElement("div"));
createBarrier(barrier1, barrier2);

player.x = width / 2 - 50;
player.y = height - 50;

player.div.style.top = player.y + "px";
player.div.style.left = player.x + "px";

// creating enemys and store them in array
createEnemy();
console.log(enemyList);

// it is the weapon ( can be deleted)
//------------------------------------
var outer = document.createElement("div");
outer.style.width = "50px";
outer.style.height = "50px";
// outer.style.background = "black";
outer.style.position = "relative";
outer.style.top = "570px";
outer.style.left = player.x + 25 + "px";
continer.appendChild(outer);
//---------------------------------------

// the enemys appear every set of time
setTimeOutList();

// Event Listeners
//--------------------------------------------------------
window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return; // Do nothing if event already handled
  }
  if (event.code === "ArrowRight") {
    isMoving = true;
    if (player.x >= 800 - 105) {
      isMoving = false;
      return;
    }
    player.x += 30;
    player.div.style.left = player.x + "px";
    outer.style.left = player.x + 25 + "px";
    isMoving = false;
    return;
  }
  if (event.code === "ArrowLeft") {
    isMoving = true;
    if (player.x <= 5) {
      isMoving = false;
      return;
    }
    player.x -= 30;
    player.div.style.left = player.x + "px";
    outer.style.left = player.x + 25 + "px";
    isMoving = false;
    return;
  }
  if (event.code === "Enter") {
    console.log("enter");

    //---------------

    var inner = document.createElement("div");
    inner.style.width = "23px";
    inner.style.height = "50px";
    // inner.style.background = "blue";
    inner.style.position = "absolute";
    inner.style.top = height - 50 - 50 + "px";
    inner.style.left = player.x + 30 + 10 + "px";
    continer.appendChild(inner);
    //---------------------

    var lesr1 = createLeser();
    var lesr2 = createLeser();

    // lesr1.style.float = "left";
    lesr1.style.left = player.x + 30 + 10 + "px";

    // lesr2.style.clear = "both";
    lesr2.style.left = player.x + 30 + 30 + "px";

    // outer.appendChild(lesr1);
    // outer.appendChild(lesr2);
    continer.appendChild(lesr1);
    continer.appendChild(lesr2);
    LeserMove(lesr1, lesr2, inner);
    // LeserMove(inner);
  }
});
//----------------------------------------------------------

// create the lesers
//------------------------------------------------------
const createLeser = () => {
  var lesr = document.createElement("div");

  lesr.style.width = "3px";
  lesr.style.height = "50px";
  lesr.style.background = "red";
  lesr.style.position = "absolute";
  lesr.style.top = height - 50 - 50 + "px";
  // lesr.style.left =player.x + "px";

  return lesr;
};
//-------------------------------------------------------

// creating enemys and store them in array
//-------------------------------------------------------
function createEnemy() {
  for (let i = 0; i < 50; i++) {
    let rand = Math.floor(Math.random() * 750);
    let enemyDiv = new Enemy(document.createElement("div"));
    enemyDiv.x = rand;
    enemyDiv.y = 0;
    enemyDiv.isIn = false;
    enemyList.push(enemyDiv);
  }

  let boss = new Enemy(document.createElement("div"));
  boss.x = 450;
  boss.y = 0;
  boss.isIn = false;
  boss.isBoss = true;
  boss.blood = 5;
  enemyList.push(boss);
}
//-------------------------------------------------------

// the movement of the leser
//------------------------------------------------------
function LeserMove(lesr1, lesr2, inner) {
  let lesrIsRemoved = false;
  var x = player.x + 30 + 10;
  var y = 570;
  var id = setInterval(frame, 20);
  function frame() {
    for (let i = 0; i < enemyList.length; i++) {
      if (isPlayAgain) {
        clearInterval(id);
        break;
      }
      const enemy = enemyList[i];

      if (lesrIsRemoved) {
        // console.log("break");
        break;
      }
      if (enemy.isRemoved) {
        // console.log("removed");
        continue;
      }

      if (
        y <= enemy.y + 50 &&
        y + 50 >= enemy.y &&
        x + 23 >= enemy.x &&
        x <= enemy.x + 50 &&
        !enemy.isRemoved &&
        !lesrIsRemoved &&
        enemy.isIn
      ) {
        totalHits++;
        score.innerHTML = "Score: " + totalHits;
        continer.removeChild(lesr1);
        continer.removeChild(lesr2);
        continer.removeChild(inner);
        lesrIsRemoved = true;
        if (enemy.isBoss) {
          enemy.blood--;
          bossBlood.innerHTML = "Boss: " + enemy.blood + "/5";
          if (enemy.blood < 1) {
            continer.removeChild(enemy.div);
            enemy.isRemoved = true;
            clearInterval(id);
            youWin();
            break;
          }
        } else {
          continer.removeChild(enemy.div);
          enemy.isRemoved = true;
          clearInterval(id);
          break;
        }
      }
    }
    if (y < 0 && !lesrIsRemoved) {
      continer.removeChild(lesr1);
      continer.removeChild(lesr2);
      continer.removeChild(inner);
      lesrIsRemoved = true;
      clearInterval(id);
    } else {
      y -= 15;
      lesr1.style.top = y + "px";
      lesr2.style.top = y + "px";
      inner.style.top = y + "px";
    }
  }
}
//------------------------------------------------------

// the movement of the enemys
//------------------------------------------------------
function enemyMove(currentEnemy) {
  currentEnemy.div.style.width = "50px";
  currentEnemy.div.style.height = "50px";
  currentEnemy.div.style.background = "red";
  currentEnemy.div.style.position = "absolute";
  currentEnemy.div.style.top = 0 + "px";
  currentEnemy.div.style.left = currentEnemy.x + "px";
  currentEnemy.isIn = true;
  continer.appendChild(currentEnemy.div);

  var pos = 0;
  let id = setInterval(frame, 50);
  function frame() {
    if (currentEnemy.isClear) {
      currentEnemy.isRemoved = true;
      continer.removeChild(currentEnemy.div);
      clearInterval(id);
    }

    if (pos > 560) {
      currentEnemy.isRemoved = true;
      continer.removeChild(currentEnemy.div);
      totalMisses--;
      misses.innerHTML = "You: " + totalMisses + "/10";

      //gmae over
      if (totalMisses < 1) {
        isGameOver = true;
        console.log("game over");
        //clearTimeOutList();
        gameIsOver();
      }
      clearInterval(id);
    } else if (currentEnemy.isRemoved) {
      clearInterval(id);
    } else if (
      (barrier1.y <= currentEnemy.y + 50 &&
        barrier1.x + 50 >= currentEnemy.x &&
        barrier1.x <= currentEnemy.x + 50) ||
      (barrier2.y <= currentEnemy.y + 50 &&
        barrier2.x + 50 >= currentEnemy.x &&
        barrier2.x <= currentEnemy.x + 50)
    ) {
      totalHits++;
      score.innerHTML = "Score: " + totalHits;
      currentEnemy.isRemoved = true;
      continer.removeChild(currentEnemy.div);
      clearInterval(id);
    } else {
      //console.log(difficulty);
      if (difficulty === 1) {
        pos += 15;
        currentEnemy.y += 15;
      } else {
        pos += 5;
        currentEnemy.y += 5;
      }
      currentEnemy.div.style.top = pos + "px";
    }
  }
}
//------------------------------------------------------

// Boss movement
//------------------------------------------------------
function bossMove(boss) {
  bossBlood.innerHTML = "Boss: " + boss.blood + "/5";
  boss.div.style.width = "90px";
  boss.div.style.height = "90px";
  boss.div.style.background = "black";
  boss.div.style.position = "absolute";
  boss.div.style.top = 0 + "px";
  boss.div.style.left = boss.x + "px";
  boss.isIn = true;
  continer.appendChild(boss.div);
  let xDir = 0; //0 = to right, 1 = to left
  let yDir = 0; //0 = to down, 1 = to up

  let id = setInterval(frame, 5);
  let shot = setInterval(shoot, 500);
  function frame() {
    //gmae over
    if (totalMisses < 1) {
      isGameOver = true;
      clearInterval(id);
      clearInterval(shot);
      console.log("game over");
      //clearTimeOutList();
      gameIsOver();
    }

    if (boss.isClear) {
      boss.isRemoved = true;
      continer.removeChild(boss.div);
      clearInterval(id);
    }

    if (boss.x + 90 >= width) {
      xDir = 1;
    }
    if (boss.x <= 0) {
      xDir = 0;
    }
    if (boss.y + 90 >= height - 100) {
      yDir = 1;
    }
    if (boss.y <= 0) {
      yDir = 0;
    }

    // hit the barriers from left
    if (
      (boss.x + 90 == barrier1.x &&
        boss.y + 90 >= barrier1.y &&
        boss.y <= barrier1.y + 100) ||
      (boss.x + 90 == barrier2.x &&
        boss.y + 90 >= barrier2.y &&
        boss.y <= barrier2.y + 100)
    ) {
      xDir = 1;
    }

    // hit the barriers from right
    if (
      (boss.x == barrier1.x + 50 &&
        boss.y + 90 >= barrier1.y &&
        boss.y <= barrier1.y + 100) ||
      (boss.x == barrier2.x + 50 &&
        boss.y + 90 >= barrier2.y &&
        boss.y <= barrier2.y + 100)
    ) {
      xDir = 0;
    }

    // hit the barriers from top
    if (
      (boss.y + 90 == barrier1.y &&
        boss.x + 90 >= barrier1.x &&
        boss.x <= barrier1.x + 50) ||
      (boss.y + 90 == barrier2.y &&
        boss.x + 90 >= barrier2.x &&
        boss.x <= barrier2.x + 50)
    ) {
      yDir = 1;
    }
    // hit the barriers from bottom
    if (
      (boss.y == barrier1.y + 100 &&
        boss.x + 90 >= barrier1.x &&
        boss.x <= barrier1.x + 50) ||
      (boss.y == barrier2.y + 100 &&
        boss.x + 90 >= barrier2.x &&
        boss.x <= barrier2.x + 50)
    ) {
      yDir = 0;
    }

    if (xDir === 0) {
      boss.x += 2;
    } else {
      boss.x -= 2;
    }
    if (yDir === 0) {
      boss.y += 2;
    } else {
      boss.y -= 2;
    }

    boss.div.style.left = boss.x + "px";
    boss.div.style.top = boss.y + "px";
  }

  function shoot() {
    if (boss.isRemoved) {
      clearInterval(shot);
    }
    //console.log("I am shooting");
    var bossInner = document.createElement("div");
    bossInner.style.width = "23px";
    bossInner.style.height = "50px";
    // bossInner.style.background = "blue";
    bossInner.style.position = "absolute";
    bossInner.style.top = boss.y + 90 + "px";
    bossInner.style.left = boss.x + 45 - 10 + "px";
    continer.appendChild(bossInner);
    //---------------------

    var bossLesr1 = createLeser();
    var bossLesr2 = createLeser();

    // lesr1.style.float = "left";
    bossLesr1.style.left = boss.x + 45 - 10 + "px";

    // lesr2.style.clear = "both";
    bossLesr2.style.left = boss.x + 45 + 10 + "px";

    // outer.appendChild(lesr1);
    // outer.appendChild(lesr2);
    continer.appendChild(bossLesr1);
    continer.appendChild(bossLesr2);

    var x = boss.x + 45 - 10;
    var y = boss.y + 90;

    let bulletInterval = setInterval(bullet, 25);

    function bullet() {
      if (y >= player.y && x <= player.x + 100 && x + 23 >= player.x) {
        totalMisses--;
        misses.innerHTML = "You: " + totalMisses + "/10";
        console.log("asdasdasasd");
      }

      if (y > height - 50) {
        continer.removeChild(bossLesr1);
        continer.removeChild(bossLesr2);
        continer.removeChild(bossInner);
        //lesrIsRemoved = true;
        clearInterval(bulletInterval);
      } else {
        y += 15;
        bossLesr1.style.top = y + "px";
        bossLesr2.style.top = y + "px";
        bossInner.style.top = y + "px";
      }
    }
  }
}
//------------------------------------------------------

//-----------------------------------------------------
function createBarrier(barrier1, barrier2) {
  barrier1.x = 250;
  barrier1.y = 250;
  barrier1.div.style.width = "50px";
  barrier1.div.style.height = "100px";
  barrier1.div.style.background = "chocolate";
  barrier1.div.style.position = "absolute";
  barrier1.div.style.top = barrier1.y + "px";
  barrier1.div.style.left = barrier1.x + "px";

  barrier2.x = 550;
  barrier2.y = 300;
  barrier2.div.style.width = "50px";
  barrier2.div.style.height = "100px";
  barrier2.div.style.background = "chocolate";
  barrier2.div.style.position = "absolute";
  barrier2.div.style.top = barrier2.y + "px";
  barrier2.div.style.left = barrier2.x + "px";

  continer.appendChild(barrier1.div);
  continer.appendChild(barrier2.div);
}
//-----------------------------------------------------

function checkDifficulty(num) {
  if (num == 1) {
    enemyTime = 500;
    difficulty = 1;
  } else {
    enemyTime = 1000;
    difficulty = 0;
  }
}

// the enemys appear every set of time
//------------------------------------------------------
function setTimeOutList() {
  for (let i = 1; i < enemyList.length; i++) {
    const currentEnemy = enemyList[i - 1];
    console.log(currentEnemy);
    timeOutList.push(setTimeout(() => enemyMove(currentEnemy), i * enemyTime));
  }
  const currentEnemy = enemyList[enemyList.length - 1];
  if (difficulty === 1) {
    timeOutList.push(setTimeout(() => bossMove(currentEnemy), 26000));
  } else {
    timeOutList.push(setTimeout(() => bossMove(currentEnemy), 51000));
  }
}
//------------------------------------------------------

// clear the timeout where the game is over
//------------------------------------------------------
function clearTimeOutList() {
  gameOver = document.getElementById("game-over");
  gameOver.style.visibility = "visible";
  for (var i = 0; i < timeOutList.length; i++) {
    clearTimeout(timeOutList[i]);
  }
}

function gameIsOver() {
  for (let i = 0; i < enemyList.length; i++) {
    if (enemyList[i].isIn && !enemyList[i].isRemoved) {
      enemyList[i].isClear = true;
    } else {
      continue;
    }
  }
  clearTimeOutList();
}

function playAgain() {
  if (!isGameOver) {
    gameIsOver();
  }
  isGameOver = false;
  gameOver = document.getElementById("game-over");
  gameOver.style.visibility = "hidden";
  totalHits = 0;
  score.innerHTML = "Score: " + totalHits;

  totalMisses = 10;
  misses.innerHTML = "You: " + totalMisses + "/10";

  bossBlood.innerHTML = "";

  enemyList = [];
  timeOutList = [];

  isGameOver = false;

  createEnemy();
  setTimeOutList();
}

function youWin() {
  gameIsOver();
  gameOver = document.getElementById("game-over");
  gameOver.innerHTML = " You Win!";
}
