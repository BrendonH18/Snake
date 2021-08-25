window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext('2d');
  MAX_X = 21;
  MAX_Y = 21;
  Wall.constructBoarderWall();
  setInterval(function() {
    if(Snake.collision[1] && Game.isReset) Game.reset();
    if (!(Game.isPause)) {
      Game.isSnakeCaughtInWall = false;
      Game.incrementLevel();
      Game.collisionTest();
      if (!(Game.isSnakeCaughtInWall)) Snake.stepAndGrow();
      Game.resetCanvas();
      Game.draw(appleImage, Apple.location)
      Wall.draw(Game.isFinale);
      Snake.draw();
      Game.renderScore();
      if(Game.isEnd) Game.end();
      if(Snake.collision[1]) Game.gameOver();
      Game.isReset = false;
    }
  },1000/Game.framesPerSecond);
}

document.addEventListener('keydown', function(event) {
  const commands_directions = {
    "ArrowLeft" : ["left", "right"],
    "ArrowRight" : ["right", 'left'],
    "ArrowUp" : ["up", 'down'],
    "ArrowDown" : ["down", 'up']
  };
  const commands_utilities = {
  "Escape" : "Pause",
  "Enter" : "Reset"
  };
  if (commands_directions[event.key] !== undefined && commands_directions[event.key][0] !== Snake.oppositeDirection) {
    Snake.direction = commands_directions[event.key][0];
    Snake.oppositeDirection = commands_directions[event.key][1]
  }
  else if (commands_utilities[event.key] !== undefined) {
    Game.isPause && commands_utilities[event.key] === "Pause" ? Game.isPause = false : Game.isPause = true;
    if (Game.isPause && commands_utilities[event.key] === "Reset") Game.isReset = true;
  }
})

const Game = {
  blockSize : 55,
  framesPerSecond : 7,
  initialSnakeSize: 4,
  isPause: false,
  isSnakeCaughtInWall: false,
  isFinale: false,
  isEnd: false,
  isReset: false,
  level: [1,1], // [before, after]
  score: 0,
  scoreTexture : 'black',
  scoreFont : '100px Ariel Bold',

  collisionTest () {
    let collisionList = Wall.boarder.concat(Wall.interior, Snake.body.slice(1))
    if (this.isFinale) collisionList.concat(Boss.location);
    if (this.collisionTest_isCollision(Snake.body[0], collisionList)) {
      this.collisionTest_isCollision_WallorSelf();
    };
    if (this.collisionTest_isCollision(Snake.body[0], Apple.location)) {
      this.collisionTest_isCollision_Apple(collisionList);
    };
    if (this.collisionTest_isCollision(Apple.location, collisionList)) Apple.move(collisionList);
  },

  collisionTest_isCollision (testPoint, testArray) {
    let results = false;
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

  collisionTest_isCollision_WallorSelf () {
    Snake.collision[1] = true;
  },

  collisionTest_isCollision_Apple (collisionList) {
    Snake.collision[2] = true;
    Apple.move(collisionList);
    Game.score += 1
    if (Game.score % 2 === 0) Game.level[0] += 1;
    if (Game.score === 16) Game.finale_DecendStaircase();
    if (Game.score === 17) Game.finale_AscendStaircase();
    if (Game.score === 18) Game.finale_CloseStaircase();
  },

  incrementLevel() {
    if (Game.level[0] != Game.level[1]) {
      this.incrementLevel_Walls();
      this.incrementLevel_Snake();
    }
  },

  incrementLevel_Walls() {
    switch (this.level[0]) {
      case 2:
      // case 11:
        Wall.interior = Wall.interior.concat(Wall.level2walls);
        break;
      case 3:
      // case 12:
        Wall.interior = Wall.interior.concat(Wall.level3walls);
        break;
      case 4:
      case 11:
        Wall.interior = Wall.interior.concat(Wall.level4walls);
        break;
      case 5:
      case 12:
        Wall.interior = Wall.interior.concat(Wall.level5walls);
        break;
      case 6:
      // case 15:
        Wall.interior = Wall.interior.concat(Wall.level6walls);
        break;
      case 7:
      // case 16:
        Wall.interior = Wall.interior.concat(Wall.level7walls);
        break;
      case 8:
      case 13:
        Wall.interior = Wall.interior.concat(Wall.level8walls);
        break;
      case 9:
        Wall.interior = []
        Wall.boarder.splice(63,1)
        Apple.location = [25,10]
        Wall.interior = Wall.interior.concat(Wall.level9walls);
        break;
      case 10:
        break;
      case 14:
        this.isEnd = true;
      break;
      default:
        break;
    }
    Game.level[1] = Game.level[0];
  },

  incrementLevel_Snake() {
    let newHead = Snake.body[0];
    if (this.collisionTest_isCollision(newHead, Wall.interior)) {
      let isLoop = true;
      while (isLoop) {
        switch (Snake.direction) {
          case "up":
            newHead[1] -= 1;
            if(newHead[1] < 0) newHead[1] = MAX_Y;
            break;
          case "down":
            newHead[1] += 1;
            if(newHead[1] > MAX_Y) newHead[1] = 0;
            break;
          case "right":
            newHead[0] += 1;
            if(newHead[0] > MAX_X) newHead[0] = 0;
            break;
          case "left":
            newHead[0] -= 1;
            if(newHead[0] < 0) newHead[0] = MAX_X;
            break;}
          if(!(this.collisionTest_isCollision(newHead, Wall.interior))) isLoop = false;
      }
      Snake.body[0] = newHead;
      Snake.draw();
      Game.isPause = true;
      Game.isSnakeCaughtInWall = true;
      setTimeout(() => {Game.isPause = false}, 3000)
    }
  },

  finale_AscendStaircase() {
    Snake.direction = "left"
    Snake.oppositeDirection = "right"
    Snake.body = [...Snake.bodyFinale];
    Apple.location = [10,10];
    Snake.draw();
    Game.draw(appleImage, Apple.location)
    Wall.draw();
    this.isPause = true;
    setTimeout(() => {this.isPause = false}, 3000);
  },

  finale_CloseStaircase() {
    Game.isFinale = true;
    Wall.boarder = []
    Wall.constructBoarderWall();
    Wall.interior = []
  },

  end() {
    Game.isPause = true;
    canvasContext.fillStyle = "black";
    canvasContext.font = "120px Arial bold";
    canvasContext.fillText('You win, Harry!', this.blockSize * 3.75, this.blockSize * 10)
    canvasContext.fillText('Congratulations!', this.blockSize * 3.5, this.blockSize * 13)
  },

  gameOver() {
    Game.isPause = true;
    canvasContext.fillStyle = "black";
    canvasContext.font = "130px Arial bold";
    canvasContext.fillText('Too bad, Harry!', this.blockSize * 3.75, this.blockSize * 9)
    canvasContext.font = "100px Arial bold";
    canvasContext.fillText('The walls are dangerous!', this.blockSize * 2, this.blockSize * 12)
    canvasContext.font = "140px Arial bold";
    canvasContext.fillText('Retry? (Enter)', this.blockSize * 4, this.blockSize * 17)
  },

  reset() {
    this.isPause = false;
    this.isFinale = false;
    this.isEnd = false;
    this.level = [1,1]; // [before, after]
    this.score = 0;
    Snake.collision[1] = false;
    Snake.body = [[3,3,'up',7],[3,4,'up',6],[3,5,'up',5],[3,6,'up',4],[3,7,'up',3],[3,8,'up',2],[3,9,'up',1]];
    Snake.collision = [false, false, false]; // [by accident, with self/wall, with apple]
    Snake.direction = 'right';
    Snake.oppositeDirection = 'left';
    Apple.location = [3,9]
    Wall.boarder = [],
    Wall.interior = [],
    Wall.constructBoarderWall();
  },

  resetCanvas() {
    canvasContext.clearRect(1, 1, canvas.clientWidth, canvas.clientHeight)
  },

  renderScore() {
    canvasContext.fillStyle = this.scoreTexture;
    canvasContext.font = this.scoreFont;
    canvasContext.fillText(`Score: ${this.score}`, this.blockSize * (MAX_X - 8), this.blockSize * 2)
  },

  draw(image, coordinateList) {
    if(coordinateList.length <= 2) {
      canvasContext.drawImage(image, coordinateList[0] * Game.blockSize, coordinateList[1] * Game.blockSize , Game.blockSize, Game.blockSize)
    } else {
      for(i = 0; i < coordinateList.length; i++) {
        canvasContext.drawImage(image, coordinateList[i][0] * Game.blockSize, coordinateList[i][1] * Game.blockSize , Game.blockSize, Game.blockSize)
      }
    }
  },
}

const Apple = {
  location: [3,9],

  move(list) {
    let isConflict
    do {
      isConflict = false
      this.location[0] = Math.floor(Math.random() * MAX_X)
      this.location[1] = Math.floor(Math.random() * MAX_Y)
      for (i = 0; i < list.length; i++) {
        if(this.location[0] === list[i][0] && this.location[1] === list[i][1]) isConflict = true;
      }
    } while (isConflict)
  }
}

const Snake = {
  body: [[3,3,'up',7],[3,4,'up',6],[3,5,'up',5],[3,6,'up',4],[3,7,'up',3],[3,8,'up',2],[3,9,'up',1]],
  bodyFinale: [[25,10,'left',7],[26,10,'left',6],[27,10,'left',5],[28,10,'left',4],[29,10,'left',3],[30,10,'left',2],[31,10,'left',1]],
  head: [],
  tail: [],
  collision: [false, false, false], // [by accident, with self/wall, with apple]
  direction: 'right',
  oppositeDirection: 'left',

  stepAndGrow() {
    const snakeTailX = this.body[this.body.length - 1][0]
    const snakeTailY = this.body[this.body.length - 1][1]
    for (i = this.body.length - 1; i > 0 ; i--) {
      this.body[i][0] = this.body[i-1][0]
      this.body[i][1] = this.body[i-1][1]
      this.body[i][2] = this.body[i-1][2]
      this.body[i][3] = this.body.length - i
    }
    switch (this.direction) {
      case 'up':
        this.body[0][1] -= 1;
        break;
      case 'down':
        this.body[0][1] += 1;
        break;
      case 'left':
        this.body[0][0] -= 1;
        break;
      case 'right':
        this.body[0][0] += 1;
        break;
    }
    this.body[0][2] = this.direction;
    this.body[0][3] = this.body.length;
    if (this.collision[2]) {
      this.body.push([snakeTailX, snakeTailY])
      this.collision[2] = false
    }
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
        Game.draw(feetImage,[this.body[i][0],this.body[i][1]])
      }
  }
}

const Wall = {
  boarder: [],
  interior: [],

  constructBoarderWall() {
    for (i = 0; i < MAX_X; i++) {
      this.boarder.push([i, 0], [i,MAX_Y])
    }
    for (i = 0; i < MAX_Y; i++) {
      this.boarder.push([0,i], [MAX_X,i])
    }
    this.boarder.push([MAX_X, MAX_Y])
  },

  draw(isFinale = false) {
    Game.draw(wallImage, this.boarder);
    Game.draw(wallImage, this.interior)
    if (isFinale) Boss.main();
    if(Game.score === 16) Game.draw(stairsDown, Wall.stairs);
    if(Game.score === 17) Game.draw(stairsUp, Wall.stairs);
  },

  level2walls:
  [
    [3,9],[3,10],[4,9],[4,10],[5,9],[5,10],[6,9],[6,10],
    [7,9],[7,10],[8,9],[8,10],[9,3],[10,3],[9,4],[10,4],
    [9,5],[10,5],[9,6],[10,6],[9,7],[10,7],[9,8],[10,8],
    [9,9],[10,9],[9,10],[10,10]
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
    [13,3],[14,3],[13,4],[14,4],[13,5],[14,5],[13,6],[14,6],
    [13,7],[14,7],[13,8],[14,8],[15,7],[15,8],[16,7],[16,8],
    [17,7],[17,8],[18,7],[18,8]
  ],

  level5walls:
  [
    [3,13],[3,14],[4,13],[4,14],[5,13],[5,14],[6,13],[6,14],
    [7,15],[7,16],[7,17],[7,18],[8,15],[8,16],[8,17],[8,18]
  ],

  level6walls:
  [
    [17,3],[18,3],[17,4],[18,4]
  ],

  level7walls:
  [
    [3,17],[3,18],[4,17],[4,18]
  ],

  level8walls:
  [
    [3,5],[4,5],[5,5],[6,5],[3,6],[4,6],[5,6],[6,6],
    [5,4],[6,4],[5,3],[6,3]
  ],

  level9walls:
  [
    [22,9],[22,11],[23,9],[23,11],[24,9],[24,11],[25,9],[25,11],
    [26,9],[26,11],[26,10]
  ],

  stairs:
  [
    [21,10],[22,10],[23,10],[24,10]
  ],
}

const Boss = {
  location: [13,6],
  wallDetector: [],
  corner: [4, null], // [corner, orientation from start]

  main() {
    this.move()
    Game.draw(wallImage,this.location);
    
  },

  move() {
    let increment = 1;
    this.determineVelocity();
    this.determineWallDetector();
    if (Game.collisionTest_isCollision(this.wallDetector, Wall.boarder.concat(Wall.interior))) {
      while (Game.collisionTest_isCollision(this.wallDetector, Wall.boarder.concat(Wall.interior))) {
        this.corner[0] += increment
        increment += 1;
        this.determineVelocity()
        this.determineWallDetector()
      }
    }
    this.step()
  },

  step() {
    this.location[0] += this.corner[1][0];
    this.location[1] += this.corner[1][1];
  },

  determineVelocity() {
    let cornerNumber = this.corner[0] % 4
    const leadingCornerList = [[1,1],[-1,1],[-1,-1],[1,-1]];
    this.corner[1] = leadingCornerList[cornerNumber]
  },

  determineWallDetector () {
    this.wallDetector[0] = this.location[0] + this.corner[1][0];
    this.wallDetector[1] = this.location[1] + this.corner[1][1];
  }
}


let canvas, canvasContext, MAX_X, MAX_Y

const feetNormalUp = new Image();
feetNormalUp.src = "images/feetNormalUp.png"
const feetNormalDown = new Image();
feetNormalDown.src = "images/feetNormalDown.png"
const feetNormalLeft = new Image();
feetNormalLeft.src = "images/feetNormalLeft.png"
const feetNormalRight = new Image();
feetNormalRight.src = "images/feetNormalRight.png"
const feetFade3Up = new Image();
feetFade3Up.src = "images/feetFade3Up.png"
const feetFade3Down = new Image();
feetFade3Down.src = "images/feetFade3Down.png"
const feetFade3Left = new Image();
feetFade3Left.src = "images/feetFade3Left.png"
const feetFade3Right = new Image();
feetFade3Right.src = "images/feetFade3Right.png"
const feetFade2Up = new Image();
feetFade2Up.src = "images/feetFade2Up.png"
const feetFade2Down = new Image();
feetFade2Down.src = "images/feetFade2Down.png"
const feetFade2Left = new Image();
feetFade2Left.src = "images/feetFade2Left.png"
const feetFade2Right = new Image();
feetFade2Right.src = "images/feetFade2Right.png"
const feetFade1Up = new Image();
feetFade1Up.src = "images/feetFade1Up.png"
const feetFade1Down = new Image();
feetFade1Down.src = "images/feetFade1Down.png"
const feetFade1Left = new Image();
feetFade1Left.src = "images/feetFade1Left.png"
const feetFade1Right = new Image();
feetFade1Right.src = "images/feetFade1Right.png"
const appleImage = new Image();
appleImage.src ="images/hallows.png"
const wallImage = new Image();
wallImage.src = "images/Wall.jpg"
const stairsUp = new Image();
stairsUp.src = "images/stairsUp.png"
const stairsDown = new Image();
stairsDown.src = "images/stairsDown.png"