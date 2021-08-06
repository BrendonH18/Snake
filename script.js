let canvas, canvasContext, MAX_X, MAX_Y

let feetNormalUp = new Image();
feetNormalUp.src = "images/feetNormalUp.jpg"
let feetNormalDown = new Image();
feetNormalDown.src = "images/feetNormalDown.jpg"
let feetNormalLeft = new Image();
feetNormalLeft.src = "images/feetNormalLeft.jpg"
let feetNormalRight = new Image();
feetNormalRight.src = "images/feetNormalRight.jpg"
let feetFade3Up = new Image();
feetFade3Up.src = "images/feetFade3Up.jpg"
let feetFade3Down = new Image();
feetFade3Down.src = "images/feetFade3Down.jpg"
let feetFade3Left = new Image();
feetFade3Left.src = "images/feetFade3Left.jpg"
let feetFade3Right = new Image();
feetFade3Right.src = "images/feetFade3Right.jpg"
let feetFade2Up = new Image();
feetFade2Up.src = "images/feetFade2Up.jpg"
let feetFade2Down = new Image();
feetFade2Down.src = "images/feetFade2Down.jpg"
let feetFade2Left = new Image();
feetFade2Left.src = "images/feetFade2Left.jpg"
let feetFade2Right = new Image();
feetFade2Right.src = "images/feetFade2Right.jpg"
let feetFade1Up = new Image();
feetFade1Up.src = "images/feetFade1Up.jpg"
let feetFade1Down = new Image();
feetFade1Down.src = "images/feetFade1Down.jpg"
let feetFade1Left = new Image();
feetFade1Left.src = "images/feetFade1Left.jpg"
let feetFade1Right = new Image();
feetFade1Right.src = "images/feetFade1Right.jpg"
let appleImage = new Image();
appleImage.src ="images/AppleSymbol.png"


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
  MAX_X = Math.floor(canvas.clientWidth/Game.blockSize) - 1
  MAX_Y = Math.floor(canvas.clientHeight/Game.blockSize) - 1
  Wall.calculateBoarderWall();

  

  setInterval(function() {
    if (!(Game.pause)) {
      
      Game.progressLevel();
      Snake.collisionTest(0);
      Snake.stepAndGrow();
      Game.resetCanvas();
      Snake.draw();
      Apple.draw();
      Wall.draw();
      Game.renderScore();
      
      
    }
  },1000/Game.framesPerSecond);
}

let Game = {
  blockSize : 55,
  framesPerSecond : 3,
  initialSnakeSize: 4,
  
  pause: false,
  level: 1,
  score: 0,

  wallTexture : '#DEB887',
  scoreTexture : 'white',
  scoreFont : '30px Ariel',
  surfaceTexture: '',

  progressLevel() {
    this.score === 1 ? Wall.interior = Wall.interior.concat(Wall.level2walls) : 
    this.score === 2 ? Wall.interior = Wall.interior.concat(Wall.level3walls) :
    this.score === 3 ? Wall.interior = Wall.interior.concat(Wall.level4walls) :
    // this.score === 4 ? Wall.interior = Wall.interior.concat(Wall.level5walls) :
    // this.score === 5 ? Wall.interior = Wall.interior.concat(Wall.level6walls) :
    // this.score === 6 ? Wall.interior = Wall.interior.concat(Wall.level7walls) :
    Wall.interior
  },

  resetCanvas() {
    canvasContext.clearRect(1, 1, canvas.clientWidth, canvas.clientHeight)
  },

  renderScore() {
    canvasContext.fillStyle = this.scoreTexture;
    canvasContext.font = this.scoreFont;
    canvasContext.fillText(`Score: ${this.score}`, this.blockSize * (MAX_X - 5), this.blockSize* 2)
  },

  drawItem(item, drawColor) {
    for (let i = 0; i < item.length; i++ ) {
      if (item[i][0] == undefined) {
        this.colorRect(item[0], item[1], drawColor)
      } else {
      this.colorRect(item[i][0], item[i][1], drawColor)
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
    this.collisionTest(1);
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

  collisionTest (place) {
    this.calcHead();
    let newBody = [...this.body];
    newBody.shift();
    let collisionList = Wall.boarder.concat(Wall.interior, newBody);
    for (i = 0; i < collisionList.length; i++) {
      if (this.head[0] === collisionList[i][0] && this.head[1] === collisionList[i][1]) {
        this.collision[place] = true;
        console.log("Wall/Snake");
        console.log(this.collision);
        this.collision[place] = false;
        console.log(this.collision);
        break;
      } else if (this.head[0] === Apple.location[0] && this.head[1] === Apple.location[1]) {
        this.apple = true;
        Game.score += 1
        console.log("Apple")
        console.log("Score: ", Game.score)
        Apple.move(collisionList);
        break;
      }
    }
  },

  calcTailLength () {
    let TailLength = this.body.length / 3
    let Fade3 = TailLength / 4
  },

  draw() {
    for (let i = 0; i < this.body.length; i++ ) {
      switch (this.body[i][3]) {
        case 4:
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
        case 3:
        case 2:
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
        canvasContext.drawImage(feetImage, this.body[i][0] * Game.blockSize, this.body[i][1] * Game.blockSize , Game.blockSize, Game.blockSize)
      }
      // draw() {
    // this.calcHead();
    // this.calcTail();

    // canvasContext.drawImage(feetUp, 50, 50, 50, 50) ;
    // drawFeet([[3, 3, 'up'],[4,4, 'down'],[5, 5, 'left'],[6,6, 'right']]);
    // drawFeetHelper(4, 4, feetRight);
    // Game.drawItem(this.body, Game.snakeBodyTexture);

    // this.drawFeet(this.body)
    // Game.drawItem(this.head, Game.snakeHeadTexture)
    // Game.drawItem(this.tail, Game.snakeTailTexture)
  // },
  }
}

let Wall = {
  boarder: [],
  interior: [],
  level2walls: [[3,9],[3,10],[4,9],[4,10],[5,9],[5,10],[6,9],[6,10],[7,9],[7,10],[8,9],[8,10],[9,3],[10,3],[9,4],[10,4],[9,5],[10,5],[9,6],[10,6],[9,7],[10,7],[9,8],[10,8],[9,9],[10,9],[9,10],[10,10]],
  level3walls: [[11,11],[12,11],[13,11],[14,11],[15,11],[16,11],[17,11],[18,11],
    [11,12],[12,12],[13,12],[14,12],[15,12],[16,12],[17,12],[18,12],
    [11,13],[12,13],[13,13],[14,13],[15,13],[16,13],[17,13],[18,13],
    [11,14],[12,14],[13,14],[14,14],[15,14],[16,14],[17,14],[18,14],
    [11,15],[12,15],[13,15],[14,15],[15,15],[16,15],[17,15],[18,15],
    [11,16],[12,16],[13,16],[14,16],[15,16],[16,16],[17,16],[18,16],
    [11,17],[12,17],[13,17],[14,17],[15,17],[16,17],[17,17],[18,17],
    [11,18],[12,18],[13,18],[14,18],[15,18],[16,18],[17,18],[18,18]],
  level4walls: [[13,3],[14,3],[13,4],[14,4],[13,5],[14,5],[13,6],[14,6],[13,7],[14,7],[13,8],[14,8],
  [15,7],[15,8],
  [16,7],[16,8],
  [17,7],[17,8],
  [18,7],[18,8]

],

  calculateBoarderWall() {
    for (i = 0; i < MAX_X; i++) {
      this.boarder.push([i, 0], [i,MAX_Y])
    }
    for (i = 0; i < MAX_Y; i++) {
      this.boarder.push([0,i], [MAX_X,i])
    }
    this.boarder.push([MAX_X, MAX_Y])
  },

  draw() {
    Game.drawItem(this.boarder, Game.wallTexture)
    Game.drawItem(this.interior, Game.wallTexture)
  },
}