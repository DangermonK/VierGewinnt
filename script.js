let canvas;
let ctx;

let game;
let timeout = 10

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

function Reload() {

    let nR = document.getElementById("rowN").value;
    let nC = document.getElementById("cellN").value;
    let nS = document.getElementById("sizeN").value;


    clearInterval(game);

    p = [];
    fillList = [];

    cellSize = nS;
    gridWidth = nC;
    gridHeight = nR;

    start();

}

function start() {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown", getPosition);

    canvas.width = gridWidth * cellSize;
    canvas.height = gridHeight * cellSize;

    width = canvas.offsetWidth;
    height = canvas.offsetHeight;

    for(let i = 0; i < gridWidth; i++) {

        fillList.push(0);

    }

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

function RunGame() {

    p.push(new Player(0));
    p.push(new Player(1));

    currentPlayer = 0;

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

        if(fillList[cell] < gridHeight) {
            console.log("hello");
            this.ballList.push(new Ball(cell));
            return true;
        }
        return false;

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
                }

            }
        }

    }

    Draw(index) {

        ctx.drawImage(texture, 16 + index * 16, 0, 16, 16, this.cell * cellSize, this.yPos, cellSize, cellSize);

    }

}