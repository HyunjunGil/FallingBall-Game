var character = document.getElementById('character');
var game = document.getElementById('game');
var both = 0;
var xv = 1;
var yv = 2;
var yv_b = 1;
var interval;
var movingBlocks = [];
var mBlockCounter = 0;
var sBlockCounter = 0;
var drop = 0;
var betweenHole = false;
var randomPosition = [];
for(let c = 0; c < 25; c++) {
  randomPosition.push(c);
}
shuffleArray(randomPosition);

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function moveLeft () {
  let left = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  if (left > 0) {
    character.style.left = (left - xv) + 'px';
  }
}
function moveRight () {
  let left = parseFloat(window.getComputedStyle(character).getPropertyValue('left'));
  if (left < 380) {
    character.style.left = (left + xv) + 'px';
  }
}

document.addEventListener('keydown', event => {
  if (both == 0) {
    both++;
    if (event.key === 'ArrowLeft') {
      interval = setInterval(moveLeft, 1);
    } else if (event.key === 'ArrowRight') {
      interval = setInterval(moveRight, 1);
    }
  }
});

document.addEventListener('keyup', () => {
  clearInterval(interval);
  both = 0;
})

var createMovingBlocks = setInterval(function () {
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

  if (characterTop < 0) {
    clearInterval(createMovingBlocks);
    alert('Game over. Score: ' + (mBlockCounter - 5));
    location.reload();
  }

  for(i = 0;i < movingBlocks.length; i++) {
    let iblock = document.getElementById('m' + movingBlocks[i]);
    let ihole = document.getElementById('h' + movingBlocks[i]);
    let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue('top'));
    let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue('left'));
    iblock.style.top = ihole.style.top = (iblockTop - yv_b) + 'px';
    
    if (iblockTop < -20) {
      movingBlocks.shift();
      iblock.remove();
      ihole.remove();
    }

    if (iblockTop > characterTop && iblockTop - 20 < characterTop) {
      drop++;
      if (iholeLeft < characterLeft && iholeLeft + 20 > characterLeft) {
        drop = 0;
      }
    }
  }
  if (drop == 0) {
    if (characterTop < 480) {
      character.style.top = (characterTop + yv) + 'px'; 
    }
  } else {
    character.style.top = (characterTop - yv_b) + 'px';
  }

}, 1);

// var createStaticBlocks = setInterval(function () {
//   return;
// }, 1);

