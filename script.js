var character = document.getElementById('character');
var game = document.getElementById('game');
var horizon_velocity = 1;
var vertical_velocity = 0.5;
var blockUp_velocity = 0.1;
var interval;
var both = 0;
var horizonBlocks = [];
var verticalBlocks = [];
var currentHorizonBlock = null;
var h_counter = 0;
var v_counter = 0;
var score = 0;
var i, j;
function init() {
  horizon_velocity = 1;
  vertical_velocity = 2;
  blockUp_velocity = 0.5;
  interval = undefined;
  both = 0;
  horizonBlocks = [];
  h_counter = 0;
  v_counter = 0;
  
}

function moveLeft() {
  var left = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  if (left > 0 && !isLeftBlock()) {
    character.style.left = (left - horizon_velocity) + "px";
  }
}
function moveRight() {
  var left = parseInt(window.getComputedStyle(character).getPropertyValue('left'));
  if (left < 380 && !isRightBlock()) {
    character.style.left = (left + horizon_velocity) + "px";
  }
}

function isLeftBlock () {
  let hasSimilar_y;
  let isAdjacent;
  let characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue('top'));
  let characterLeft = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  let i;
  for (i = 0; i < horizonBlocks.length; i++) {
    let ihole = document.getElementById('h' + horizonBlocks[i]);
    let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue('left'));
    let iholeTop = parseFloat(window.getComputedStyle(ihole).getPropertyValue('top'));

    //수평벽이 공에 간섭을 주는 y좌표를 가지는지 확인
    hasSimilar_y = !(iholeTop > characterTop + 20 || iholeTop + 20 < characterTop);

    //공의 왼쪽이 수평벽의 오른쪽에 의해 막혔는지 확인
    isAdjacent = (iholeLeft >= characterLeft);

    if (hasSimilar_y && isAdjacent) return true;
  }
  for (i = 0; i < verticalBlocks.length; i++) {
    let iverticalBlock = document.getElementById('v' + verticalBlocks[i]);
    let iverticalLeft = parseFloat(window.getComputedStyle(iverticalBlock).getPropertyValue('left'));
    let iverticalTop = parseFloat(window.getComputedStyle(iverticalBlock).getPropertyValue('top'));
    // 수직벽이 공에 간섭을 주는 y좌표를 가지는지 확인
    hasSimilar_y = !(iverticalTop > characterTop + 20 || iverticalTop + 50 < characterTop);

    // 공의 왼쪽이 구멍의 왼쪽에 의해 막혔는지 확인
    isAdjacent = (iverticalLeft + 21 >= characterLeft);

    if (hasSimilar_y && isAdjacent) return true;
  }
  return false;
}
function isRightBlock () {
  let hasSimilar_y;
  let isAdjacent;
  let characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue('top'));
  let characterLeft = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  let i;
  for (i = 0; i < horizonBlocks.length; i++) {
    let ihole = document.getElementById('h' + horizonBlocks[i]);
    let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue('left'));
    let iholeTop = parseFloat(window.getComputedStyle(ihole).getPropertyValue('top'));

    //수평벽이 공에 간섭을 주는 y좌표를 가지는지 확인
    hasSimilar_y = !(iholeTop > characterTop + 19 || iholeTop + 19 < characterTop);

    //공의 오른쪽이 구멍의 오른쪽에 의해 막혔는지 확인
    isAdjacent = (iholeLeft + 20 <= characterLeft);

    if (hasSimilar_y && isAdjacent) return true;
  }
  for (i = 0; i < verticalBlocks.length; i++) {
    let iverticalBlock = document.getElementById('v' + verticalBlocks[i]);
    let iverticalLeft = parseFloat(window.getComputedStyle(iverticalBlock).getPropertyValue('left'));
    let iverticalTop = parseFloat(window.getComputedStyle(iverticalBlock).getPropertyValue('top'));
    // 수직벽이 공에 간섭을 주는 y좌표를 가지는지 확인
    let hasSimilar_y = !(iverticalTop > characterTop + 19 || iverticalTop + 49 < characterTop);

    // 공의 오른쪽이 수직벽의 왼쪽에 의해 막혔는지 확인
    let isAdjacent = (iverticalLeft <= characterLeft + 21);

    if (hasSimilar_y && isAdjacent) return true;
  }
  return false;
}


function isBetweenVerticalAndHorizon () {
  let characterLeft = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  let characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue('top'));
  for (i = 0; i < verticalBlocks.length; i++) {
    let ivertical = document.getElementById('v' + verticalBlocks[i]);
    console.log(ivertical);
    console.log(verticalBlocks);
    let iverticalTop = parseFloat(window.getComputedStyle(ivertical).getPropertyValue('top'));
    let iverticalLeft = parseFloat(window.getComputedStyle(ivertical).getPropertyValue('left'));
    for (j = 0; j < horizonBlocks.length; j++) {
      let ihorizon = document.getElementById('h' + horizonBlocks[j]);
      let ihorizonTop = parseFloat(window.getComputedStyle(ihorizon).getPropertyValue('top'));
      let ihorizonLeft = parseFloat(window.getComputedStyle(ihorizon).getPropertyValue('left'));

      //수직벽 아래 있는지 확인
      let belowVertical = !(iverticalLeft > characterLeft + 20 || iverticalLeft + 20 < characterLeft);

      //수평벽 위에 있는지 확인(구멍위가 아닌것을 확인), 이 수펑벽 위에 공이 있는지 확인
      let onHorizontal = !(ihorizonLeft < characterLeft && ihorizonLeft + 20 > characterLeft) && (Math.abs(ihorizonTop - characterTop) < 22);

      //수직벽 사이의 공간과 수평벽 사이의 공간이 20보다 작은지 확인
      let narrow = (iverticalTop + 50 - ihorizonTop) < 20;
      
      if (belowVertical && onHorizontal && narrow) {
        return true;
      }
    }
  }
  return false;
}


document.addEventListener('keydown', event => {
  if (both == 0) {
    both++;
    if (event.key === 'ArrowLeft') {
      interval = setInterval(moveLeft, 1);
    }
    if (event.key === 'ArrowRight') {
      interval = setInterval(moveRight, 1);
    }
  }
});


document.addEventListener('keyup', event => {
  clearInterval(interval);
  both = 0;
});

var generateVerticalblocks = setInterval(function () {
  var warningBlock = document.createElement('div');
  var vBlock = document.createElement('div');
  setTimeout(function () {
    warningBlock.remove();
    verticalBlocks.push(v_counter);
    v_counter++;
    game.appendChild(vBlock);
  }, 5000);
  let randomTop = Math.floor(Math.random() * 475);
  let randomLeft = Math.floor(Math.random() * 379);

  vBlock.setAttribute('class', 'verticalBar');
  vBlock.setAttribute('id', 'v' + v_counter);
  vBlock.style.top = randomTop + 'px';
  vBlock.style.left = randomLeft + 'px';

  
  warningBlock.setAttribute('class', 'warningBlock');
  warningBlock.setAttribute('id', 'w' + v_counter);
  warningBlock.style.top = randomTop + 'px';
  warningBlock.style.left = randomLeft + 'px';
  warningBlock.style.animation = 'blink 500ms linear 5 alternate';

  game.appendChild(warningBlock);

}, 10000);

var generateHorizonblocks = setInterval(function () {
  var blockLast = document.getElementById('b' + (h_counter - 1));
  var holeLast = document.getElementById('h' + (h_counter - 1));
  if (h_counter > 0) {
    var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue('top'));
    var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue('top'));
  }
  if (blockLastTop < 400 || h_counter == 0) {
    var block = document.createElement('div');
    var hole = document.createElement('div');
    block.setAttribute('class', 'horizontalBar');
    hole.setAttribute('class', 'hole');
    block.setAttribute('id', 'b' + h_counter);
    hole.setAttribute('id', 'h' + h_counter);

    block.style.top = blockLastTop + 100 + 'px';
    hole.style.top = holeLastTop + 100 + 'px';
    hole.style.left = Math.floor(Math.random() * 360) + 'px';

    game.appendChild(block);
    game.appendChild(hole);
    horizonBlocks.push(h_counter);
    h_counter++;

  }

  var characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue('top'));
  var characterLeft = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  var drop = 0;
  if (characterTop <= 0 || isBetweenVerticalAndHorizon()) {
    alert('Game over. Score: ' + (h_counter - 5));
    clearInterval(generateHorizonblocks);
    clearInterval(generateVerticalblocks);
    location.reload();
  } 

  for (i = 0; i < horizonBlocks.length; i++) {
    let current = horizonBlocks[i];
    let iblock = document.getElementById('b' + current);
    let ihole = document.getElementById('h' + current);
    let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue('top'));
    let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue('left'));
    iblock.style.top = iblockTop - blockUp_velocity + 'px';
    ihole.style.top = iblockTop - blockUp_velocity + 'px';
    if (iblockTop < -20) {
      horizonBlocks.shift();
      iblock.remove();
      ihole.remove();
    }

    //수평블럭과 겹쳐있을 때
    if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
      drop++;
      //그 겹쳐진 수평블럭에서 공의 위치가 구멍에 포함되어 있을 때
      if (iholeLeft <= characterLeft && iholeLeft + 20 > characterLeft) {
        drop = 0;
      }
    }
  }
  if (drop == 0 && !isOnVerticalBlock()) {
    if (characterTop < 480) {
      character.style.top = characterTop + vertical_velocity + 'px';
    } 
  } else {
    character.style.top = characterTop - blockUp_velocity + 'px';
  }
}, 1)

function isOnVerticalBlock () {
  let characterTop = parseFloat(window.getComputedStyle(character).getPropertyValue('top'));
  let characterLeft = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  for (let i = 0; i < verticalBlocks.length; i++) {
    let ivertical = document.getElementById('v' + verticalBlocks[i]);
    let iverticalTop = parseFloat(window.getComputedStyle(ivertical).getPropertyValue('top'));
    let iverticalLeft = parseFloat(window.getComputedStyle(ivertical).getPropertyValue('left'));

    //x축방향으로 서로 겹쳤는지 확인
    let overlap_x = !(iverticalLeft > characterLeft + 20 && iverticalLeft + 20 < characterLeft);

    //y축방향으로 공이 수직벽에 올라가 있는지 확인
    let adjacent_y = !(characterTop + 20 >= iverticalTop);

    if (overlap_x && adjacent_y) return true;
  }
  return false;
}