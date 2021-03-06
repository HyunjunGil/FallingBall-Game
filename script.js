class ScoreInfo {
  constructor (score) {
    this.score = score;
    this.time = new Date();
  }
}

var rankers = new Map();
renderScoreBoard();

function renderScoreBoard (str = "n") {
  for(let i = 1; i < 6; i++){
    rankers.set(i, JSON.parse(localStorage.getItem(str + i)));
  }
  //화면 업데이트
  for (let i = 1; i < 6; i++) {
    if (rankers.get(i) === null) {
      document.getElementById('row' + i).innerHTML = `<td>${i}</td><td></td><td></td>`;
    } else {
      document.getElementById('row' + i).innerHTML = 
        `<td>${i}</td><td>${rankers.get(i).score}</td><td>${rankers.get(i).time}</td>`;
    }
  }
}

function updateHighscore(score) {
  let str = "";
  if (flagSpeedup && flagBlind) {
    str = "bs";
  } else if (flagSpeedup && !flagBlind) {
    str = "s";
  } else if (!flagSpeedup && flagBlind) {
    str = "b";
  } else {
    str = "n";
  }
  if (score === undefined) {
    renderScoreBoard(str);
  } else {
    let result = new ScoreInfo(score);
    let i = 5;
    //5등부터 점수를 확인하며 순위를 찾아감
    while (i > 0) {
      if (rankers.get(i) === null || rankers.get(i).score <= result.score) {
        i--;
      } else break;
    }
    i++;
    //이 시점에서 i가 현재 등수
    let j = 4;
    
    //등수 조정 및 local storage 업데이트
    while (j >= i) {
      rankers.set(j+1, rankers.get(j));
      localStorage.setItem(str + (j+1), JSON.stringify(rankers.get(j)));
      j--;
    }
    rankers.set(i, result);
    localStorage.setItem(str + i, JSON.stringify(result));

    //화면 업데이트
    for (let i = 1; i < 6; i++) {
      if (rankers.get(i) === null) {
        break;
      }
      document.getElementById('row' + i).innerHTML = 
        `<td>${i}</td><td>${rankers.get(i).score}</td><td>${rankers.get(i).time}</td>`
    }
  }
  
}

var character = document.getElementById('character');
var game = document.getElementById('game');
var blind = document.getElementById('blind');
var accelerate = document.getElementById('accelerate');
var both = 0;
var xv = 1.5;
var yv = 2;
var yv_b = 0.5;
var interval;
var movingBlocks = [];
var mBlockCounter = 0;
var sBlockCounter = 0;
var drop = 0;
var betweenHole = 0;
var onGame = false;
var startGame_movingBlocks;
var startGame_staticBlocks;
var addStaticBlocks_timer;
var setStaticBlockPosition_timer;

var accel_interval;
var flagSpeedup = false;
var flagBlind = false;

var randomPosition;



function initializeGame() {
  character.style.top = 50 + 'px';
  character.style.left = 190 + 'px';
  clearBlocks();
  xv = 1.5;
  yv = 2;
  yv_b = 0.5;
  movingBlocks = [];
  mBlockCounter = sBlockCounter = drop = betweenHole = 0;
  randomPosition = [];
  for(let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      randomPosition.push({'left': (190 - (j-i)*50) + 'px', 'top': (50 + (i+j) * 60) + 'px'});
    }
  }
  shuffleArray(randomPosition);

  onGame = true;
  startGame_movingBlocks = setInterval(createMovingBlocks, 1);
  startGame_staticBlocks = setInterval(createStaticBlocks, 10000);
  if (flagSpeedup) {
    accel_interval = setInterval(accelerateGame, 8000);
  }
  
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function moveLeft () {
  let left = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  if (left > 0 && !adjacentToHoleLeft() && !adjacentToStaticBlockRight()) {
    character.style.left = (left - xv) + 'px';
  }
}
function moveRight () {
  let left = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  if (left < 380 && !adjacentToHoleRight() && !adjacentToStaticBlockLeft()) {
    character.style.left = (left + xv) + 'px';
  }
}

//createMovingBlocks에 포함시킬 수 있지 않을까? 
function adjacentToHoleLeft () {
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  for (let i = 0; i < movingBlocks.length; i++) {
    let ihole = document.getElementById('h' + movingBlocks[i]);
    let iholeTop = parseInt(window.getComputedStyle(ihole).getPropertyValue('top'));
    let iholeLeft = parseInt(window.getComputedStyle(ihole).getPropertyValue('left'));
    let flag1 = Math.abs(iholeTop - characterTop) <= 20;
    let flag2 = Math.abs(iholeLeft - characterLeft) <= 1;
    if(flag1 && flag2) return true;
  }
  return false;
}
function adjacentToHoleRight () {
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  for (let i = 0; i < movingBlocks.length; i++) {
    let ihole = document.getElementById('h' + movingBlocks[i]);
    let iholeTop = parseInt(window.getComputedStyle(ihole).getPropertyValue('top'));
    let iholeLeft = parseInt(window.getComputedStyle(ihole).getPropertyValue('left'));
    let flag1 = Math.abs(iholeTop - characterTop) <= 20;
    let flag2 = Math.abs(iholeLeft + 20 - characterLeft) <= 1;
    if(flag1 && flag2) return true;
  }
  return false;
}

function adjacentToStaticBlockLeft () {
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  for (let i = 0; i < sBlockCounter; i++) {
    let sBlock = document.getElementById('s' + i);
    let sBlockTop = parseInt(window.getComputedStyle(sBlock).getPropertyValue('top'));
    let sBlockLeft = parseInt(window.getComputedStyle(sBlock).getPropertyValue('left'));
    let flag1 = Math.abs(sBlockTop + 15 - characterTop) <= 35;
    let flag2 = Math.abs(sBlockLeft - characterLeft - 20) <= 1;
    if (flag1 && flag2) return true;
  }
  return false;
}
function adjacentToStaticBlockRight () {
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  for (let i = 0; i < sBlockCounter; i++) {
    let sBlock = document.getElementById('s' + i);
    let sBlockTop = parseInt(window.getComputedStyle(sBlock).getPropertyValue('top'));
    let sBlockLeft = parseInt(window.getComputedStyle(sBlock).getPropertyValue('left'));
    let flag1 = Math.abs(sBlockTop + 15 - characterTop) <= 35;
    let flag2 = Math.abs(sBlockLeft + 20 - characterLeft) <= 1;
    if (flag1 && flag2) return true;
  }
  return false;
}
function onStaticBlock () {
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  for (let i = 0; i < sBlockCounter; i++) {
    let sBlock = document.getElementById('s' + i);
    let sBlockTop = parseInt(window.getComputedStyle(sBlock).getPropertyValue('top'));
    let sBlockLeft = parseInt(window.getComputedStyle(sBlock).getPropertyValue('left'));
    let flag1 = Math.abs(sBlockLeft - characterLeft) <= 20;
    let flag2 = Math.abs(sBlockTop - characterTop - 20) <= 1;
    if (flag1 && flag2) return true;
  }
  return false;
}

function betweenMovingAndStatic () {
  let characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseInt(window.getComputedStyle(character).getPropertyValue('top'));
  for (let i = 0; i < sBlockCounter; i++) {
    let sBlock = document.getElementById('s' + i);
    let sBlockTop = parseInt(window.getComputedStyle(sBlock).getPropertyValue('top'));
    let sBlockLeft = parseInt(window.getComputedStyle(sBlock).getPropertyValue('left'));
    let flag1 = Math.abs(sBlockLeft - characterLeft) <= 19;
    let flag2 = Math.abs(sBlockTop + 50 - characterTop) == 0;
    if (flag1 && flag2) return true;
  }
  return false;
}

function clearBlocks () {
  for (let i = 0; i < movingBlocks.length; i++) {
    document.getElementById('m' + movingBlocks[i]).remove();
    document.getElementById('h' + movingBlocks[i]).remove();
  }
  for (i = 0; i < 16; i++) {
    let sBlock = document.getElementById('s' + i);
    if (sBlock !== null) {
      sBlock.remove();
    }
  }
}

document.addEventListener('keydown', event => {
  if (onGame && both == 0) {
    both++;
    if (event.key === 'ArrowLeft') {
      interval = setInterval(moveLeft, 1);
    } else if (event.key === 'ArrowRight') {
      interval = setInterval(moveRight, 1);
    }
  }
  if (!onGame && event.key === 'Enter') {
    initializeGame();
  }
});

document.addEventListener('keyup', () => {
  clearInterval(interval);
  both = 0;
})

blind.addEventListener('click', event => {
  if (onGame) return;
  if (event.target.checked) {
    flagBlind = true;
  } else {
    flagBlind = false;
  }
  updateHighscore();
})

accelerate.addEventListener('click', event => {
  if (onGame) return;
  if (event.target.checked) {
    flagSpeedup = true;
  } else {
    flagSpeedup = false;
  }
  updateHighscore();
})

function createMovingBlocks () {
  var i = 0;
  var mLast = document.getElementById('m' + (mBlockCounter - 1));
  var hLast = document.getElementById('h' + (mBlockCounter - 1));

  if (mBlockCounter > 0) {
    var mLastTop = parseFloat(window.getComputedStyle(mLast).getPropertyValue('top'));
    var hLastTop = parseFloat(window.getComputedStyle(hLast).getPropertyValue('top'));
  }

  if (mLastTop <= 400 || mBlockCounter == 0) {
    var newBlock = document.createElement('div');
    var newHole = document.createElement('div');
    newBlock.setAttribute('class', 'movingBlock');
    newBlock.setAttribute('id', 'm' + mBlockCounter);
    newBlock.style.top = mLastTop + 100 + 'px';

    newHole.setAttribute('class', 'hole');
    newHole.setAttribute('id', 'h' + mBlockCounter);
    newHole.style.top = hLastTop + 100 + 'px';
    newHole.style.left = Math.floor(Math.random() * 360) + 'px';

    game.appendChild(newBlock);
    game.appendChild(newHole);
    movingBlocks.push(mBlockCounter);
    mBlockCounter++;

  }

  var characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue('top'));
  var characterLeft = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  var characterTop_int = parseInt(characterTop);
  var characterLeft_int = parseInt(characterLeft);


  if (characterTop < 0 || betweenMovingAndStatic()) {
    clearInterval(startGame_movingBlocks);
    clearInterval(startGame_staticBlocks);
    clearTimeout(addStaticBlocks_timer);
    clearTimeout(setStaticBlockPosition_timer);
    if (flagSpeedup) {
      clearInterval(accel_interval);
    }
    let score = mBlockCounter - 5;
    alert('Game over. Score: ' + score);
    document.getElementById('scoreSpan').innerHTML = 0;
    updateHighscore(score);
    onGame = false;
    return;
  }
  document.getElementById('scoreSpan').innerHTML = mBlockCounter > 5 ? mBlockCounter - 5 : 0;

  for(i = 0;i < movingBlocks.length; i++) {
    let iblock = document.getElementById('m' + movingBlocks[i]);
    let ihole = document.getElementById('h' + movingBlocks[i]);
    let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue('top'));
    let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue('left'));
    let iblockTop_int = parseInt(iblockTop);
    let iholeLeft_int = parseInt(iholeLeft);
    iblock.style.top = ihole.style.top = (iblockTop - yv_b) + 'px';
    
    if (iblockTop < -20) {
      movingBlocks.shift();
      iblock.remove();
      ihole.remove();
    }

    if (iblockTop_int + 20 >= characterTop_int && iblockTop_int - 20 <= characterTop_int) {
      drop++;
      if (iholeLeft_int <= characterLeft_int && iholeLeft_int + 20 >= characterLeft_int) {
        drop = 0;
      }
    }
  }
  if (drop == 0 && !onStaticBlock()) {
    if (characterTop < 480) {
      character.style.top = (characterTop + yv) + 'px'; 
    }
  } else {
    character.style.top = (characterTop - yv_b) + 'px';
  }

}

function createStaticBlocks() {
  if (sBlockCounter == 14) {
    clearInterval(createStaticBlocks);
  }
  let sBlock = document.createElement('div');
  let wBlock = document.createElement('div');
  addStaticBlocks_timer = setTimeout(addStaticBlocks, 10000, wBlock, sBlock);
  setStaticBlockPosition_timer = setTimeout(setStaticBlockPosition, 8000, wBlock, sBlock);
}

function addStaticBlocks (wBlock, sBlock) {
 wBlock.remove();
 game.appendChild(sBlock);
 sBlockCounter++; 
}

function setStaticBlockPosition (wBlock, sBlock) {
  let pos = randomPosition.pop();
  sBlock.setAttribute('class', 'staticBlock');
  sBlock.setAttribute('id', 's' + sBlockCounter);
  wBlock.setAttribute('class', 'staticBlock');
  wBlock.setAttribute('id', 'w' + sBlockCounter);
  sBlock.style.left = wBlock.style.left = pos['left'];
  sBlock.style.top = wBlock.style.top = pos['top'];
  if (flagBlind) {
    sBlock.style.backgroundColor = 'white';
  }
  wBlock.style.animation = 'blink 500ms linear 4 alternate';

  game.appendChild(wBlock);
}

function accelerateGame () {
  xv += 0.1;
  yv += 0.1;
  yv_b += 0.1;
}