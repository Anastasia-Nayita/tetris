document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const width = 10;
    let nextRandom = 0;
    let score = 0;
    const colors = ["orange", "hotpink", "green", "purple", "red"];
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-btn");
    const reloadBtn = document.querySelector("#reload");
    let timerId;

    const lTetrmino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
    ];

    const zTetrmino = [
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
    ];

    const tTetrmino = [
        [1, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width + 2],
        [1, width, width + 1, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
    ];

    const oTetrmino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];

    const iTetrmino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
    ];

    const allTetrminoes = [
        lTetrmino,
        zTetrmino,
        tTetrmino,
        oTetrmino,
        iTetrmino,
    ];

    let currentPosition = 4;
    let currentRotation = 0;
    let random = Math.floor(Math.random() * allTetrminoes.length);
    let current = allTetrminoes[random][currentRotation];

    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("tetrmino");
            squares[currentPosition + index].style.backgroundColor =
                colors[random];
        });
    }

    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove("tetrmino");
            squares[currentPosition + index].style.backgroundColor = "";
        });
    }

    // timerId = setInterval(moveDown, 250);

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        }
        if (e.keyCode === 39) {
            moveRight();
        }
        if (e.keyCode === 38) {
            rotate();
        }
        if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener("keydown", control);

    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (
            current.some((index) =>
                squares[currentPosition + index + width].classList.contains(
                    "taken"
                )
            )
        ) {
            current.forEach((index) =>
                squares[currentPosition + index].classList.add("taken")
            );
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * allTetrminoes.length);
            current = allTetrminoes[random][currentRotation];
            currentPosition = 4;

            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(
            (index) => (currentPosition + index) % width === 0
        );
        if (!isAtLeftEdge) currentPosition -= 1;
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(
            (index) => (currentPosition + index) % width === width - 1
        );
        if (!isAtRightEdge) currentPosition += 1;
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            currentPosition -= 1;
        }
        draw();
    }

    ///// rotation

    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = allTetrminoes[random][currentRotation];
        draw();
    }

    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetriminoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2] /* lTetromino */,
        [
            0,
            displayWidth,
            displayWidth + 1,
            displayWidth * 2 + 1,
        ] /* zTetromino */,
        [1, displayWidth, displayWidth + 1, displayWidth + 2] /* tTetromino */,
        [0, 1, displayWidth, displayWidth + 1] /* oTetromino */,
        [
            1,
            displayWidth + 1,
            displayWidth * 2 + 1,
            displayWidth * 3 + 1,
        ] /* iTetromino */,
    ];

    function displayShape() {
        displaySquares.forEach((square) => {
            square.classList.remove("tetrmino");
            square.style.background = "";
        });
        upNextTetriminoes[nextRandom].forEach((index) => {
            displaySquares[displayIndex + index].classList.add("tetrmino");
            displaySquares[displayIndex + index].style.backgroundColor =
                colors[nextRandom];
        });
    }

    ////// stop start btn
    startBtn.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        } else {
            draw();
            timerId = setInterval(moveDown, 250);
            nextRandom = Math.floor(Math.random() * allTetrminoes.length);
            displayShape();
        }
    });

    reloadBtn.addEventListener("click", () => {
        window.location.reload();
    });

    /// add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [
                i,
                i + 1,
                i + 2,
                i + 3,
                i + 4,
                i + 5,
                i + 6,
                i + 7,
                i + 8,
                i + 9,
            ];

            if (
                row.every((index) => squares[index].classList.contains("taken"))
            ) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach((index) => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetrmino");
                    squares[index].style.backgroundColor = "";
                });
                const squaresRemoved = squares.splice(i, width);
                //console.log("squaresRemoved ", squaresRemoved);
                squares = squaresRemoved.concat(squares);
                squares.forEach((cell) => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            scoreDisplay.innerHTML = "end";
            clearInterval(timerId);
            alert("GAME OVER");
        }
    }
});
