document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid");
    for (var i = 0; i < 384; i++) {
        grid.innerHTML += "<div></div>";
    }
    for (var j = 0; j < 16; j++) {
        grid.innerHTML += '<div class="taken"></div>';
    }
    let squares = Array.from(document.querySelectorAll(".grid div"));

    const width = 16;
    let nextRandomShape = 0;
    let nextRandomColor;
    let score = 0;
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#start-btn");
    const reloadBtn = document.querySelector("#reload");
    const caterpillarBtn = document.querySelector("#caterpillar");
    caterpillarBtn.classList.add("hidden");
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

    let currentPosition = 8;
    let currentRotation = 0;
    let randomShape = Math.floor(Math.random() * allTetrminoes.length);
    let randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    let current = allTetrminoes[randomShape][currentRotation];

    function draw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.add("tetrmino");

            squares[
                currentPosition + index
            ].style.backgroundColor = randomColor;
        });
        if (score >= 10) {
            caterpillarBtn.classList.remove("hidden");
        } else {
            caterpillarBtn.classList.add("hidden");
        }
    }

    function undraw() {
        current.forEach((index) => {
            squares[currentPosition + index].classList.remove("tetrmino");
            squares[currentPosition + index].style.backgroundColor = "";
        });
    }

    function control(e) {
        if (timerId) {
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
    }
    document.addEventListener("keydown", control);

    function moveDown() {
        freeze();
        undraw();
        currentPosition += width;
        draw();
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
            randomShape = nextRandomShape;
            randomColor = nextRandomColor;
            nextRandomShape = Math.floor(Math.random() * allTetrminoes.length);
            nextRandomColor =
                "#" + Math.floor(Math.random() * 16777215).toString(16);
            current = allTetrminoes[randomShape][currentRotation];
            currentPosition = 8;

            draw();
            displayShape();
            addScore("check");
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        if (!isAtLeftEdge()) currentPosition -= 1;
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
        if (!isAtRightEdge()) currentPosition += 1;
        if (
            current.some((index) =>
                squares[currentPosition + index].classList.contains("taken")
            )
        ) {
            currentPosition -= 1;
        }
        draw();
    }

    function isAtRightEdge() {
        return current.some(
            (index) => (currentPosition + index) % width === width - 1
        );
    }
    function isAtLeftEdge() {
        return current.some((index) => (currentPosition + index) % width === 0);
    }

    ///// rotation

    function rotationCheck(P) {
        P = P || currentPosition;
        if ((P + 1) % width < 8) {
            if (isAtRightEdge()) {
                currentPosition += 1;
                rotationCheck(P);
            }
        } else if (P % width > 9) {
            if (isAtLeftEdge()) {
                currentPosition -= 1;
                rotationCheck(P);
            }
        }
    }

    function rotate() {
        undraw();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = allTetrminoes[randomShape][currentRotation];
        rotationCheck();
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

        upNextTetriminoes[nextRandomShape].forEach((index) => {
            displaySquares[displayIndex + index].classList.add("tetrmino");
            displaySquares[
                displayIndex + index
            ].style.backgroundColor = nextRandomColor;
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
            nextRandomShape = Math.floor(Math.random() * allTetrminoes.length);
            displayShape();
        }
    });

    reloadBtn.addEventListener("click", () => {
        window.location.reload();
    });

    caterpillarBtn.addEventListener("click", () => {
        addScore("caterpillar");
    });

    /// add score
    function addScore(arg) {
        if (arg === "check") {
            for (let i = 0; i < 384; i += width) {
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
                    i + 10,
                    i + 11,
                    i + 12,
                    i + 13,
                    i + 14,
                    i + 15,
                ];

                if (
                    row.every((index) =>
                        squares[index].classList.contains("taken")
                    )
                ) {
                    score += 10;
                    scoreDisplay.innerHTML = score;
                    row.forEach((index) => {
                        squares[index].classList.remove("taken");
                        squares[index].classList.remove("tetrmino");
                        squares[index].style.backgroundColor = "";
                    });
                    const squaresRemoved = squares.splice(i, width);
                    squares = squaresRemoved.concat(squares);
                    squares.forEach((cell) => grid.appendChild(cell));
                }
            }
        } else if (arg === "caterpillar") {
            for (let i = 368; i < 384; i += width) {
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
                    i + 10,
                    i + 11,
                    i + 12,
                    i + 13,
                    i + 14,
                    i + 15,
                ];
                score -= 10;
                scoreDisplay.innerHTML = score;
                row.forEach((index) => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetrmino");
                    squares[index].style.backgroundColor = "";
                });
                const squaresRemoved = squares.splice(i, width);
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
