var field;
var canvas;
var rows = 16;
var cols = 30;
const maxWidth = 1400; // pixels
const maxHeight = 700;
var canvasWidth = window.innerWidth < maxWidth ? window.innerWidth - 10 : maxWidth;
var canvasHeight = (rows / cols) * canvasWidth;
var cellSize = Math.floor(canvasWidth / cols);
var gameIsOver = false;
var messageP;
var numMines = 99;
var numMinesP;
var markedCount = 0;
var markedCountP;
var successesP;

function setCanvasDimensions() {
    if (rows / cols < 1) {
        canvasWidth = window.innerWidth < maxWidth ? window.innerWidth - 10 : maxWidth;
        canvasHeight = (rows / cols) * canvasWidth;
    } else {
        canvasHeight = window.innerHeight < maxHeight ? window.innerWidth : maxHeight;
        canvasWidth = canvasHeight;
    }
}

function create2DArray(rows, cols) {
    const arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function revealSafeNeighbors(i, j) {
    field[i][j].isRevealed = true;
    field[i][j].isMarked = false;
    if (field[i][j].neighboringMines == 0) {
        for (let k = -1; k <= 1; k++) {
            for (let l = -1; l <= 1; l++) {
                if ((i + k >= 0 && i + k < cols) && (j + l >= 0 && j + l < rows)) {
                    if (!field[i + k][j + l].isRevealed) {
                        revealSafeNeighbors(i + k, j + l);
                    }
                }
            }
        }
    }
}

function excavate(i, j) {
    if (field[i][j].hasMine) {
        gameOver();
    } else {
        revealSafeNeighbors(i, j);
    }
}

function mousePressed() {
    if (!gameIsOver) {
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                if (field[i][j].contains(mouseX, mouseY)) {
                    if (mouseButton === LEFT) {
                        if (field[i][j].isRevealed) {
                            for (let k = -1; k <= 1; k++) {
                                for (let l = -1; l <= 1; l++) {
                                    if ((i + k >= 0 && i + k < cols) && (j + l >= 0 && j + l < rows)) {
                                        if (!field[i + k][j + l].isMarked) {
                                            excavate(i + k, j + l);
                                        }
                                    }
                                }
                            }
                        } else {
                            excavate(i, j);
                        }
                    } else {
                        if (!field[i][j].isRevealed) {
                            field[i][j].isMarked = !field[i][j].isMarked;
                        }
                    }
                }
            }
        }
    }
}

function calcNeighboringMines(i, j) {
    let mines = 0;
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            if ((i + k >= 0 && i + k < cols) && (j + l >= 0 && j + l < rows)) {
                if (field[i + k][j + l].hasMine) {
                    mines++;
                }
            }
        }
    }
    return mines;
}

function revealAllMines(shouldExplode) {
    let successes = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (field[i][j].hasMine) {
                field[i][j].isRevealed = true;
                field[i][j].isExploded = shouldExplode;
                if (field[i][j].isMarked) {
                    successes++;
                }
            }
        } 
    }
    if (successes == numMines) {
        successesP.style('color: green');
    } else {
        successesP.style('color: red');
    }
    successesP.html('Successful markers: <b>' + successes + '</b>');
}

function gameOver() {
    gameIsOver = true;
    messageP.style('color: red');
    messageP.html('Game Over!');
    revealAllMines(true);
}

function checkWin() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cell = field[i][j];
            if (!cell.isRevealed && !cell.hasMine) {
                return;
            } else if (cell.hasMine && !cell.isMarked) {
                return;
            } else if (cell.isMarked && !cell.hasMine) {
                return;
            }
        }
    }
    gameIsOver = true;
    revealAllMines(false);
    messageP.style('color: green');
    messageP.html('You win! Congratulations!');
}

function createField() {
    field = create2DArray(rows, cols);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            field[i][j] = new Cell(i * cellSize, j * cellSize, cellSize);
        }
    }

    let count = 0;
    while (count < numMines) {
        let i = Math.floor(Math.random() * cols);
        let j = Math.floor(Math.random() * rows);
        if (!field[i][j].hasMine) {
            field[i][j].hasMine = true;
            count++;
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            field[i][j].neighboringMines = calcNeighboringMines(i, j);
        }
    }
}

function restart() {
    createField();
    gameIsOver = false;
    messageP.html('');
    successesP.html('');
    numMinesP.html('Number of mines: <b>' + numMines + '</b>');
}

function changeDifficulty(difficulty) {
    if (difficulty == 'easy') {
        rows = 8;
        cols = 8;
        numMines = 10;
    } else if (difficulty == 'medium') {
        rows = 16;
        cols = 16;
        numMines = 40;
    } else {
        rows = 16;
        cols = 30;
        numMines = 99;
    }
    restart();
    resize();
}

function setDifficultyEasy() {
    changeDifficulty('easy');
}

function setDifficultyMedium() {
    changeDifficulty('medium');
}

function setDifficultyHard() {
    changeDifficulty('hard');
}

function createInfoPanel() {
    messageP = createP('');    
    successesP = createP('');
    numMinesP = createP('Number of mines: <b>' + numMines + '</b>');
    markedCountP = createP(0);
}

function createButtonPanel() {
    let restartButton = createButton('Restart');
    restartButton.mouseClicked(restart);
    createDiv('<br>');
    let easyButton = createButton('Easy');
    easyButton.mouseClicked(setDifficultyEasy);
    let mediumButton = createButton('Medium');
    mediumButton.mouseClicked(setDifficultyMedium);
    let hardButton = createButton('Hard');
    hardButton.mouseClicked(setDifficultyHard);
    let div = createDiv('Change Difficulty: ');
    div.child(easyButton);
    div.child(mediumButton);
    div.child(hardButton);
}

function createDocument() {
    setCanvasDimensions();
    canvas = createCanvas(canvasWidth, canvasHeight);
    createInfoPanel();
    createButtonPanel();
}

function resize() {
    setCanvasDimensions();
    cellSize = Math.floor(canvasWidth / cols);
    canvas.size(canvasWidth, canvasHeight);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            field[i][j].size = cellSize;
            field[i][j].x = i * cellSize;
            field[i][j].y = j * cellSize;
        }
    }
}

function setup() {
    window.addEventListener('resize', resize);
    createDocument();
    createField();    
}

function draw() {
    markedCount = 0;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {            
            field[i][j].show();
            if (field[i][j].isMarked) {
                markedCount++;
            }
        }
    }
    markedCountP.html('Markers placed: <b>' + markedCount + '</b>');
    
    if (markedCount == numMines) {
        checkWin();
    }
}
