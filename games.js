const canvas = document.querySelector('#game')
const game = canvas.getContext("2d")
const btnUp = document.querySelector("#up")
const btnDown = document.querySelector("#down")
const btnLeft = document.querySelector("#left")
const btnRight = document.querySelector("#right")
const spanLives = document.querySelector("#lives")
const spanTime = document.querySelector("#tiempo")
const spanRecord = document.querySelector("#record")
const Resultado = document.querySelector("#resultado")
const winMessage = document.querySelector(".wingame-container")
const restartButton = document.querySelector(".game-restart")
const restartButton2 = document.querySelector(".game-restart2")
const loseMessage = document.querySelector(".gameOver-container")

let lives = 3
let level = 0
let timeStart;
let timeInterval;

restartButton.addEventListener("click", reload)
restartButton2.addEventListener("click", reload)


const playerPosition = {
    x: undefined,
    y: undefined
}
const giftPosition = {
    x: undefined,
    y: undefined
}
const doorPosition = {
    x: undefined,
    y: undefined
}
let enemiesPositions = []


let canvasSize;
let elementSize;
function reload() {
    location.reload()
}
window.addEventListener("load", setCanvasSize)
window.addEventListener("resize", setCanvasSize)
window.addEventListener("resize", startGame)
window.addEventListener("keydown", keyboard)

function clearMap() {
    game.clearRect(0, 0, canvasSize, canvasSize)
}

function movePlayer() {
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
    if (giftCollision) {
        lvlWin();
    }
    if (enemiesPositions.find(item => item.x.toFixed(3) == playerPosition.x.toFixed(3) && item.y.toFixed(3) == playerPosition.y.toFixed(3))) {
        console.log("Chocaste con una bomba")
       lvlLost()
    }

    

}


function setCanvasSize() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.7
    }
    else {
        canvasSize = window.innerHeight * 0.7
    }
    canvas.setAttribute("width", canvasSize + 10)
    canvas.setAttribute("height", canvasSize)

    playerPosition.x = undefined
    playerPosition.y = undefined
    elementSize = Math.floor(canvasSize / 10);
    startGame()
}
function startGame() {
    game.font = elementSize + "px Helvetica";
    game.textAlign = "end";
    enemiesPositions = []
    const map = maps[level]

    if (!map) {

        winConfig()
        return;
    }


    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100)
        showRecord();
    }

    const mapRows = map.trim().split("\n")
    const mapRowCols = mapRows.map(row => row.trim().split(''))
    clearMap()

    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = elementSize * (colI + 1.2)
            const posY = elementSize * (rowI + 1)
            game.fillText(emoji, posX, posY)

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX
                    playerPosition.y = posY

                }
            } else if (col == 'I') {
                giftPosition.x = posX
                giftPosition.y = posY


            }
            else if (col == 'X') {
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                });

            }

            game.fillText(emoji, posX, posY)
        });

    });
    movePlayer()
    showLives()


    /*  for (let row = 1; row <= 10; row++) {
         for(let col = 1; col <= 10; col++) {
             game.fillText(emojis[mapRowCol[row - 1][col - 1]], elementSize * col, elementSize * row);
         }
     } *///game.fillRect(0,25,100,100)
    //El primer parametro es donde va a empezar en el Eje X, el Segundo donde empieza en el Eje Y
    // El tercer parámetro es el width y el cuarto parámetro es el height 
    /*  game.clearRect(50,50,50,50) */
    //game.font = "23px helvetica"
    //game.fillStyle = "Blue"
    //game.textAlign = "center"
    // Al usar text align "Platzi" se va a posicionar con respecto al Eje X que le dimos, si el eje x tiene un valor de 100 entonces en esas coordenadas de 100 se va a ir posicionando a la derecha (End),izquierda(Start) y centro
    //game.fillText("Platzi", 100 , 20)

}

function lvlWin() {
    console.log('Subiste de nivel!');
    level++;
    startGame()
}
function winConfig() {

    clearInterval(timeInterval)


    const recordTime = localStorage.getItem("record_time")
    const playerTime = formatTime(Date.now() - timeStart)
    if (recordTime) {
        if (recordTime >= playerTime) {
            localStorage.setItem("record_time", playerTime)
            Resultado.textContent = "Record superado"
        } else {
            Resultado.textContent = "Record no superado"
        }
    } else {
        localStorage.setItem("record_time", playerTime)
        Resultado.textContent = "Primer record"
    }
    winMessage.classList.remove("inactive")

}
function formatTime(milisegundos) {
    const segundos = Math.floor(milisegundos / 1000);
    const milisegs = Math.floor(milisegundos / 100);


    return ` ${segundos} segundos ${milisegs} milisegundos`;
}

 function lvlLost() {
    playerPosition.x = doorPosition.x;
    playerPosition.y = doorPosition.y;
    lives--;
    if (lives <= 0) {
        gameOver()
    }
    startGame()
}
function showColision() {
    game.fillText (emojis['BOMB_COLLISION'], playerPosition.x, playerPosition.y);
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    console.log ('choque');
    
  }
function showLives() {
    let heartsArray = Array(lives).fill(emojis["HEART"])
    spanLives.textContent = heartsArray.join("")

}
function showTime() {
    spanTime.textContent = formatTime(Date.now() - timeStart)
}
function showRecord() {
    spanRecord.textContent = localStorage.getItem("record_time")
}

let validator = true
function gameOver() {
    clearInterval(timeInterval)
    loseMessage.classList.remove("inactive")
    btnDown.removeEventListener("click", moveDown)
    btnUp.removeEventListener("click", moveUp)
    btnLeft.removeEventListener("click", moveLeft)
    btnRight.removeEventListener("click", moveRight)
    validator = false
    //timeStart = Date.now();
}
btnUp.addEventListener("click", moveUp)
btnDown.addEventListener("click", moveDown)
btnLeft.addEventListener("click", moveLeft)
btnRight.addEventListener("click", moveRight)

function keyboard(event) {
    if (validator){
        switch (event.key) {
            case "ArrowUp":
                moveUp()
                break;
            case "ArrowDown":
                moveDown()
                break;
            case "ArrowLeft":
                moveLeft()
                break;
            case "ArrowRight":
                moveRight()
                break;
            default:
                break;
        }
    }else{
        return
    }
    

}

function moveUp() {
    if (playerPosition.y <= elementSize + 10) {
        console.log("Arriba");
    } else {
        playerPosition.y -= elementSize
        startGame()
    }

}
function moveDown() {
    if (playerPosition.y >= canvasSize - 20) {
        console.log("Abajo");
    } else {
        playerPosition.y += elementSize

        startGame()
    }
}
function moveLeft() {
    if (playerPosition.x <= elementSize + 20) {
        console.log("izquierda");
    } else {
        playerPosition.x -= elementSize



        startGame()
    }
}
function moveRight() {
    if (playerPosition.x >= canvasSize - 10) {
        console.log("derecha");
    } else {
        playerPosition.x += elementSize

        startGame()
    }
}

