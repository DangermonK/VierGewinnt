let canvas;
let ctx;

let game;
let timeout = 10;
let running = false;
let ending = false;

let width;
let height;
let cellSize = 32;
let gridWidth = 7;
let gridHeight = 6;

let now = Date.now();
let last;
let deltaTime;

let fillList = [];

let p = [];
let currentPlayer;

let texture;

let dirMatr = [
    [1,0],
    [1,1],
    [0,1],
    [1,-1]
];

function EndGameCallback() {

    if(ending === false) {
        ending = true;

        console.log("spieler "+ currentPlayer +" hat gewonnen");

        // hier code für ending events

        setTimeout(ResetGame, 1000); // zeit nach der das spiel resetet wird
    }
}

function start() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", getPosition);

    canvas.width = gridWidth * cellSize;
    canvas.height = gridHeight * cellSize;

    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    texture = new Image();
    texture.src = "robin.png";

    RunGame();

}

function getPosition(event)
{

    let x = event.x;

    x -= canvas.offsetLeft;

    let gridX = Math.floor(x / cellSize);

    if(p[currentPlayer].SetBall(gridX)) {
        currentPlayer ++;
        if(currentPlayer >= p.length)
            currentPlayer = 0;
    }

}

function ResetGame() {

    fillList = [];
    p = [];

    clearInterval(game);
    RunGame();

}

function RunGame() {

    for(let i = 0; i < gridWidth; i++) {

        fillList.push(0);

    }

    p.push(new Player(0));
    p.push(new Player(1));

    currentPlayer = 0;

    running = true;
    ending = false;

    game = setInterval(Draw, timeout);

}

function Update() {

    last = now;
    now = Date.now();
    deltaTime = (now - last) / 1000;

    for(let i = 0; i < p.length; i++) {
        p[i].Update();
    }

}

function Draw() {

    Update();

    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    for(let i = 0; i < p.length; i++) {
        p[i].Draw();
    }

    for(let i = 0; i < gridHeight; i++) {
        for(let j = 0; j < gridWidth; j++) {
            ctx.drawImage(texture, 0, 0, 16, 16, j * cellSize, i * cellSize, cellSize, cellSize);
        }
    }

}

class Player {

    constructor(index) {

        this.index = index;
        this.ballList = [];

    }

    SetBall(cell) {

        if(fillList[cell] < gridHeight && running) {
            this.ballList.push(new Ball(cell));
            this.CheckBalls();
            return true;
        }
        return false;

    }

    FindBall(x, y) {

        let ball = null;

        this.ballList.forEach(b => {

            if(b.cell === x && b.row === y) {

                ball = b;
            }

        });

        return ball;

    }

    CheckBallDir(ball, dir, count) {

        let b = this.FindBall(ball.cell + dirMatr[dir][0], ball.row + dirMatr[dir][1]);

        if(b !== null) {
            count++;
            if(count >= 4)
                return count;
            return this.CheckBallDir(b, dir, count);
        } else {
            return count;
        }

    }

    CheckBalls() {

        this.ballList.forEach(b => {

            for(let dir = 0; dir < dirMatr.length; dir++) {
                let n = this.CheckBallDir(b, dir, 1);
                if(n >= 4) {
                    running = false;
                }
            }

        });

    }

    Update() {

        for(let i = 0; i < this.ballList.length; i++) {

            this.ballList[i].Update();

        }

    }

    Draw() {

        for(let i = 0; i < this.ballList.length; i++) {

            this.ballList[i].Draw(this.index);

        }

    }

}

class Ball {

    constructor(cell) {

        fillList[cell] ++;

        this.row = fillList[cell];

        this.cell = cell;
        this.yPos = 0 - cellSize;

        this.yVel = 0;
        this.yAcc = 20;

        this.run = true;

    }

    Update() {

        if(this.run) {
            this.yPos += this.yVel * deltaTime;
            this.yVel += this.yAcc;

            if (this.yPos > height - this.row * cellSize) {

                this.yVel = -(this.yVel) * 0.5;
                this.yPos = height - this.row * cellSize;

                if (Math.sqrt(this.yVel * this.yVel) < 40) {
                    this.yVel = 0;
                    this.run = false;
                    if(!running && !ending) {
                        EndGameCallback();
                    }
                }

            }
        }

    }

    Draw(index) {

        ctx.drawImage(texture, 16 + index * 16, 0, 16, 16, this.cell * cellSize, this.yPos, cellSize, cellSize);

    }

}