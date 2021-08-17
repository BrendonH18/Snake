//#region 
let canvas, canvasContext, MAX_X, MAX_Y

let feetNormalUp = new Image();
feetNormalUp.src = "images/feetNormalUp.png"
let feetNormalDown = new Image();
feetNormalDown.src = "images/feetNormalDown.png"
let feetNormalLeft = new Image();
feetNormalLeft.src = "images/feetNormalLeft.png"
let feetNormalRight = new Image();
feetNormalRight.src = "images/feetNormalRight.png"
let feetFade3Up = new Image();
feetFade3Up.src = "images/feetFade3Up.png"
let feetFade3Down = new Image();
feetFade3Down.src = "images/feetFade3Down.png"
let feetFade3Left = new Image();
feetFade3Left.src = "images/feetFade3Left.png"
let feetFade3Right = new Image();
feetFade3Right.src = "images/feetFade3Right.png"
let feetFade2Up = new Image();
feetFade2Up.src = "images/feetFade2Up.png"
let feetFade2Down = new Image();
feetFade2Down.src = "images/feetFade2Down.png"
let feetFade2Left = new Image();
feetFade2Left.src = "images/feetFade2Left.png"
let feetFade2Right = new Image();
feetFade2Right.src = "images/feetFade2Right.png"
let feetFade1Up = new Image();
feetFade1Up.src = "images/feetFade1Up.png"
let feetFade1Down = new Image();
feetFade1Down.src = "images/feetFade1Down.png"
let feetFade1Left = new Image();
feetFade1Left.src = "images/feetFade1Left.png"
let feetFade1Right = new Image();
feetFade1Right.src = "images/feetFade1Right.png"
let appleImage = new Image();
appleImage.src ="images/hallows.png"
let wallImage = new Image();
wallImage.src = "images/Wall.jpg"

//#endregion
document.addEventListener('keydown', function(event) {
  const commands = {
    directions : {
      "ArrowLeft" : ["left", "right"],
      "ArrowRight" : ["right", 'left'],
      "ArrowUp" : ["up", 'down'],
      "ArrowDown" : ["down", 'up']},
    // properties : {
    //   "Escape" : function () {debugger},
    //   "Escape" : Game.pause === false ? Game.pause = true : Game.pause = false
      // "Escape" : console.log("yes") 
    // }
  }
  if (commands.directions[event.key] != undefined && commands.directions[event.key][0] != Snake.oppositeDirection) {
    Snake.direction = commands.directions[event.key][0];
    Snake.oppositeDirection = commands.directions[event.key][1]
    // console.log("Directions", Snake.direction, Snake.oppositeDirection, commands.properties[event.key])
  } 
  // else if (commands.properties[event.key] != undefined) {
  //   console.log("Properties ", commands.properties[event.key])
  //   commands.properties[event.key]
  // }
})

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext('2d');
  MAX_X = 21;
  MAX_Y = 21;
  Wall.calculateBoarderWall();
  setInterval(function() {
    if (!(Game.isPause)) {
      Game.isMoveSnake = false;
      Snake.draw();  
      Game.progressLevel();
      Snake.draw();
      Snake.collisionTest();
      Snake.draw();
      Game.isMoveSnake != true ? Snake.stepAndGrow() : Game.isMoveSnake = false;
      Snake.draw();
      Game.resetCanvas();
      Snake.draw();
      Apple.draw();
      Snake.draw();
      Wall.draw();
      Snake.draw();
      Game.renderScore();
    }
  },1000/Game.framesPerSecond);
}

let Game = {
  blockSize : 55,
  framesPerSecond : 5,
  initialSnakeSize: 4,
  
  isPause: false,
  isMoveSnake: false,
  level: [1,1],
  score: 0,

  scoreTexture : 'white',
  scoreFont : '80px Ariel Bold',
  
  progressLevel() {
    if (Game.level[0] != Game.level[1]) {
      this.progressLevel_Walls();
      this.progressLevel_Snake();
    }
  },

  progressLevel_Walls() {
    this.level[0] === 2 ? Wall.interior = Wall.interior.concat(Wall.level2walls) : 
    this.level[0] === 3 ? Wall.interior = Wall.interior.concat(Wall.level3walls) :
    this.level[0] === 4 ? Wall.interior = Wall.interior.concat(Wall.level4walls) :
    this.level[0] === 5 ? Wall.interior = Wall.interior.concat(Wall.level5walls) :
    this.level[0] === 6 ? Wall.interior = Wall.interior.concat(Wall.level6walls) :
    this.level[0] === 7 ? Wall.interior = Wall.interior.concat(Wall.level7walls) :
    this.level[0] === 8 ? Wall.interior = Wall.interior.concat(Wall.level8walls) :
    Wall.interior
    Game.level[1] = Game.level[0];
  },

  progressLevel_Snake() {
    Snake.calcHead();
    let testWall = [...Wall.interior]
    if (Snake.isGetCollisionTestInstance(Snake.head, testWall) === true) {
      let isLoop = true;
      let newHead = Snake.head
      while (isLoop) {
        switch (Snake.direction) {
          case "up":
            newHead[1] -= 1;
            newHead[1] < 0 ? newHead[1] = MAX_Y : newHead[1] = newHead[1];
            break;
          case "down":
            newHead[1] += 1;
            newHead[1] > MAX_Y ? newHead[1] = 0 : newHead[1] = newHead[1];
            break;
          case "right":
            newHead[0] += 1;
            newHead[0] > MAX_X ? newHead[0] = 0 : newHead[0] = newHead[0];
            break;
          case "left":
            newHead[0] -= 1;
            newHead[0] < 0 ? newHead[0] = MAX_X : newHead[0] = newHead[0];
            break;}
          Snake.isGetCollisionTestInstance(newHead, testWall) != true ? isLoop = false : isLoop = true
      }
      Snake.body[0][0] = newHead[0];
      Snake.body[0][1] = newHead[1];
      Snake.draw();
      Game.isPause = true;
      Game.isMoveSnake = true;
      setTimeout(() => {Game.isPause = false}, 3000)
    }
  },


  resetCanvas() {
    canvasContext.clearRect(1, 1, canvas.clientWidth, canvas.clientHeight)
  },

  renderScore() {
    canvasContext.fillStyle = this.scoreTexture;
    canvasContext.font = this.scoreFont;
    canvasContext.fillText(`Score: ${this.score}`, this.blockSize * (MAX_X - 5), this.blockSize* 2)
  },

  drawImage(image, coordinateList) {
    if(coordinateList.length <= 2) {
      canvasContext.drawImage(image, coordinateList[0] * Game.blockSize, coordinateList[1] * Game.blockSize , Game.blockSize, Game.blockSize)
    } else {
      for(i = 0; i < coordinateList.length; i++) {
        canvasContext.drawImage(image, coordinateList[i][0] * Game.blockSize, coordinateList[i][1] * Game.blockSize , Game.blockSize, Game.blockSize)
      }
    }
  },

  colorRect (gridX, gridY, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(this.blockSize*gridX, this.blockSize*gridY, this.blockSize, this.blockSize)
  }
}

let Apple = {
  location: [3,9],
  locationNew: [[3,9],[3,10]],

  draw() {
    canvasContext.drawImage(appleImage, this.location[0] * Game.blockSize, this.location[1] * Game.blockSize , Game.blockSize, Game.blockSize)
  },

  move(list) {
    let isConflict = true
    while (isConflict) {
      let conflictList = []
      this.location[0] = Math.floor(Math.random() * MAX_X)
      this.location[1] = Math.floor(Math.random() * MAX_Y)
      for (i = 0; i < list.length; i++) {
        if(this.location[0] === list[i][0] && this.location[1] === list[i][1]) {
          conflictList.push(true)
        } else conflictList.push(false)
      }
      isConflict = conflictList.some(e => e === true)    
    }
  }
}

let Snake = {
  body: [[3,3,'up',7],[3,4,'up',6],[3,5,'up',5],[3,6,'up',4],[3,7,'up',3],[3,8,'up',2],[3,9,'up',1]],
  head: [],
  tail: [],
  collision: [false, false],
  apple: false,
  direction: 'right',
  oppositeDirection: 'left',

  calcHead() {this.head = this.body[0]},
  calcTail() {this.tail = this.body[this.body.length - 1]},

  stepAndGrow() {
    let tailX, tailY
    if (this.apple === true) {
      this.calcTail();
      tailX = this.tail[0]
      tailY = this.tail[1]
    }
    for (i = this.body.length - 1; i > 0 ; i--) {
      this.body[i][0] = this.body[i-1][0]
      this.body[i][1] = this.body[i-1][1]
      this.body[i][2] = this.body[i-1][2]
      this.body[i][3] = this.body.length - i
    }
    switch (this.direction) {
      case 'up':
        this.body[0][1] -= 1;
        this.body[0][2] = 'up';
        this.body[0][3] = this.body.length;
        break;
      case 'down':
        this.body[0][1] += 1;
        this.body[0][2] = 'down';
        this.body[0][3] = this.body.length;
        break;
      case 'left':
        this.body[0][0] -= 1;
        this.body[0][2] = 'left';
        this.body[0][3] = this.body.length;
        break;
      case 'right':
        this.body[0][0] += 1;
        this.body[0][2] = 'right';
        this.body[0][3] = this.body.length;
        break;
    }
    if (this.apple === true) {
      this.body.push([tailX, tailY])
      this.apple = false
    }
  },

  collisionTest () {
    this.calcHead();
    let newBody = [...this.body];
    newBody.shift();
    let collisionList = Wall.boarder.concat(Wall.interior, newBody);
    if (this.isGetCollisionTestInstance(this.head, collisionList) === true) {
      this.collision[1] = true;
      console.log("Wall/Snake");
    };
    if (this.isGetCollisionTestInstance(this.head, Apple.location) === true) {
      this.apple = true;
      Game.score += 1
      if (Game.score % 2 === 0) Game.level[0] += 1;
      console.log("Apple")
      Apple.move(collisionList);
    };
    if (this.isGetCollisionTestInstance(Apple.location, collisionList) === true) Apple.move(collisionList);
  },

  isGetCollisionTestInstance (testPoint, testArray) {
    let results = false
    if (testArray.length <= 2) {
      testPoint[0] === testArray[0] && testPoint[1] === testArray[1] ? results = true : results = false
    } else {
      for (i = 0; i < testArray.length; i++) {
        if (testPoint[0] === testArray[i][0] && testPoint[1] === testArray[i][1]) {
          results = true;
        }
      }
    }
    return results;
  },

  calcTailLength () {
    let TailLength = this.body.length / 3
    let Fade3 = TailLength / 4
  },

  draw() {
    let feetImage
    for (let i = 0; i < this.body.length; i++ ) {
      switch (this.body[i][3]) {
        case 6:
        case 5:
          switch (this.body[i][2]) {
            case 'up':
              feetImage = feetFade3Up; 
              break;
            case 'down':
              feetImage = feetFade3Down;
              break;
            case 'left':
              feetImage = feetFade3Left; 
              break;
            case 'right':
              feetImage = feetFade3Right;
            break;
          }
          break;
        case 4:
        case 3:
          switch (this.body[i][2]) {
            case 'up':
              feetImage = feetFade2Up; 
              break;
            case 'down':
              feetImage = feetFade2Down;
              break;
            case 'left':
              feetImage = feetFade2Left; 
              break;
            case 'right':
              feetImage = feetFade2Right;
            break;
          }
          break;
        case 2:
        case 1:
          switch (this.body[i][2]) {
            case 'up':
              feetImage = feetFade1Up; 
              break;
            case 'down':
              feetImage = feetFade1Down;
              break;
            case 'left':
              feetImage = feetFade1Left; 
              break;
            case 'right':
              feetImage = feetFade1Right;
            break;
          }
          break;
        default:
          switch (this.body[i][2]) {
            case 'up':
              feetImage = feetNormalUp; 
              break;
            case 'down':
              feetImage = feetNormalDown;
              break;
            case 'left':
              feetImage = feetNormalLeft; 
              break;
            case 'right':
              feetImage = feetNormalRight;
            break;
          }
        }
        Game.drawImage(feetImage,[this.body[i][0],this.body[i][1]])
      }
  }
}

let Wall = {
  boarder: [],
  interior: [],
//#region 
  level2walls: 
  [
  [3,9],[3,10],[4,9],[4,10],[5,9],[5,10],[6,9],[6,10],[7,9],[7,10],[8,9],[8,10],[9,3],[10,3],[9,4],[10,4],[9,5],[10,5],[9,6],[10,6],[9,7],[10,7],[9,8],[10,8],[9,9],[10,9],[9,10],[10,10]
  ],

  level3walls: 
  [
  [11,11],[12,11],[13,11],[14,11],[15,11],[16,11],[17,11],[18,11],
  [11,12],[12,12],[13,12],[14,12],[15,12],[16,12],[17,12],[18,12],
  [11,13],[12,13],[13,13],[14,13],[15,13],[16,13],[17,13],[18,13],
  [11,14],[12,14],[13,14],[14,14],[15,14],[16,14],[17,14],[18,14],
  [11,15],[12,15],[13,15],[14,15],[15,15],[16,15],[17,15],[18,15],
  [11,16],[12,16],[13,16],[14,16],[15,16],[16,16],[17,16],[18,16],
  [11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[17,17],[18,17],
  [11,18],[12,18],[13,18],[14,18],[15,18],[16,18],[17,18],[18,18]
  ],

  level4walls: 
  [
  [13,3],[14,3],[13,4],[14,4],[13,5],[14,5],[13,6],[14,6],[13,7],[14,7],[13,8],[14,8],
  [15,7],[15,8],
  [16,7],[16,8],
  [17,7],[17,8],
  [18,7],[18,8]
  ],

  level5walls: 
  [
  [3,13],[3,14],
  [4,13],[4,14],
  [5,13],[5,14],
  [6,13],[6,14],
  [7,15],[7,16],[7,17],[7,18],
  [8,15],[8,16],[8,17],[8,18]
  ],

  level6walls: 
  [
  [17,3],[18,3],
  [17,4],[18,4]
  ],

  level7walls: 
  [
  [3,17],[3,18],
  [4,17],[4,18],
  ],

  level8walls: 
  [
  [3,5],[4,5],[5,5],[6,5],
  [3,6],[4,6],[5,6],[6,6],
  [5,4],[6,4],
  [5,3],[6,3],
  ],



//#endregion
  calculateBoarderWall() {
    for (i = 0; i < MAX_X; i++) {
      this.boarder.push([i, 0], [i,MAX_Y])
    }
    for (i = 0; i < MAX_Y; i++) {
      this.boarder.push([0,i], [MAX_X,i])
    }
    this.boarder.push([MAX_X, MAX_Y])
  },

  draw(isFinale = false) {
    if (!isFinale) Game.drawImage(wallImage, this.boarder);
    Game.drawImage(wallImage, this.interior)
  },
}