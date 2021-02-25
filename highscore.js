class ScoreInfo {
  constructor (score) {
    this.score = score;
    this.time = new Date();
  }
}

var rankers = new Map();
for(let i = 1; i < 6; i++){
  rankers.set(i, undefined);
}

function updateHighscore(score) {
  let result = new ScoreInfo(score);
  let i = 5;
  while (i > 0) {
    if (rankers.get(i) === undefined || rankers.get(i).score <= result.score) {
      i--;
    } else break;
  }
  i++;
  let j = 4;
  while (j >= i) {
    rankers.set(j+1, rankers.get(j));
    j--;
  }
  rankers.set(i, result);
  for (let i = 1; i < 6; i++) {
    if (rankers.get(i) === undefined) {
      break;
    }
    document.getElementById('row' + i).innerHTML = 
      `<td>${i}</td><td>${rankers.get(i).score}</td><td>${rankers.get(i).time}</td>`
  }
}