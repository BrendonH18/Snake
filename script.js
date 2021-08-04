let canvas, canvasContext, MAX_X, MAX_Y
const BLOCK_SIZE = 50, framesPerSecond = 5

document.addEventListener('keydown', function(event) {
  const commands = {
    directions : {
      "ArrowLeft" : ["left", "right"],
      "ArrowRight" : ["right", 'left'],
      "ArrowUp" : ["up", 'down'],
      "ArrowDown" : ["down", 'up']}
  }
  if (commands.directions[event.key] != undefined && commands.directions[event.key][0] != Snake.oppositeDirection) {
    Snake.direction = commands.directions[event.key][0];
    Snake.oppositeDirection = commands.directions[event.key][1]
  }
})

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext('2d');
  MAX_X = Math.floor(canvas.clientWidth/BLOCK_SIZE) - 1
  MAX_Y = Math.floor(canvas.clientHeight/BLOCK_SIZE) - 1
  Wall.calculateBoarderWall();
  setInterval(function() {
    
    canvasContext.clearRect(0,0,canvas.clientWidth, canvas.clientHeight);
    Snake.draw();
    Apple.draw();
    Wall.draw();
    Snake.collisionTest();
    Snake.step();
    
  },1000/framesPerSecond);
}

let Game = {
  pause: false,
  level: 1,
  score: 0
}

let Apple = {
  location: [5,5],

  draw() {
    drawItem(Apple.location, 'pink')
  },

  move(list) {
    let isConflict = true
    while (isConflict) {
      let conflictList = []
      Apple.location[0] = Math.floor(Math.random() * MAX_X)
      Apple.location[1] = Math.floor(Math.random() * MAX_Y)
      for (i = 0; i < list.length; i++) {
        if(Apple.location[0] === list[i][0] && Apple.location[1] === list[i][1]) {
          conflictList.push(true)
        } else conflictList.push(false)
      }
      isConflict = conflictList.some(e => e === true)    
    }
  }
}

let Snake = {
  body: [[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9],[3,10],[3,11],[3,12],[3,13]],
  head: [],
  tail: [],
  collision: false,
  apple: false,
  direction: 'right',
  oppositeDirection: 'left',

  calcHead() {Snake.head = Snake.body[0]},
  calcTail() {Snake.tail = Snake.body[Snake.body.length - 1]},

  step() {
    let tailX, tailY
    if (Snake.apple === true) {
      Snake.calcTail();
      tailX = Snake.tail[0]
      tailY = Snake.tail[1]
    }
    for (i = Snake.body.length - 1; i > 0 ; i--) {
      Snake.body[i][1] = Snake.body[i-1][1]
      Snake.body[i][0] = Snake.body[i-1][0]
    }
    switch (Snake.direction) {
      case 'up':
        Snake.body[0][1] -= 1;
        break;
      case 'down':
        Snake.body[0][1] += 1;
        break;
      case 'left':
        Snake.body[0][0] -= 1;
        break;
      case 'right':
        Snake.body[0][0] += 1;
        break;
    }
    if (Snake.apple === true) {
      Snake.body.push([tailX, tailY])
      Snake.apple = false
    }
  },

  collisionTest () {
    let newBody = [...Snake.body]
    newBody.shift();
    let collisionList = Wall.boarder.concat(Wall.interior, newBody);
    for (i = 0; i < collisionList.length; i++) {
      if (Snake.head[0] === collisionList[i][0] && Snake.head[1] === collisionList[i][1]) {
        Snake.collision = true;
        console.log("Wall/Snake")
        break;
      } else if (Snake.head[0] === Apple.location[0] && Snake.head[1] === Apple.location[1]) {
        Snake.apple = true;
        Game.score += 1
        console.log("Apple")
        console.log("Score: ", Game.score)
        Apple.move(collisionList);
        break;
      }
    }
  },

  draw() {
    Snake.calcHead();
    Snake.calcTail();
    drawItem(Snake.body, "yellow");
    drawItem(Snake.head, "blue")
    drawItem(Snake.tail, "pink")
  }
}

let Wall = {
  boarder: [],
  interior: [[6,7],[6,6]],

  calculateBoarderWall() {
    for (i = 0; i < MAX_X; i++) {
      Wall.boarder.push([i, 0], [i,MAX_Y])
    }
    for (i = 0; i < MAX_Y; i++) {
      Wall.boarder.push([0,i], [MAX_X,i])
    }
    Wall.boarder.push([MAX_X, MAX_Y])
  },

  draw() {
    drawItem(Wall.boarder, "gray")
    drawItem(Wall.interior, "gray")
  },
}

function drawItem(item, drawColor) {
  for (let i = 0; i < item.length; i++ ) {
    if (item[i][0] == undefined) {
      colorRect(item[0], item[1], drawColor)
    } else {
    colorRect(item[i][0], item[i][1], drawColor)
    }
  }
}

function colorRect (gridX, gridY, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(BLOCK_SIZE*gridX, BLOCK_SIZE*gridY, BLOCK_SIZE, BLOCK_SIZE)
}