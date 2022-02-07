(function () {
    //0 = empty position
    const winningSquare = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 12,
        13, 14, 15, 0
    ]

    let array = [];


    //TODO: upload to aws pipeline and route to /15puzzle

    function repositionEmptyPosition() {

        //clone the passed square so it is not changed.
        let tempSquare = JSON.parse(JSON.stringify(array));

        if (array[15] == 0) return tempSquare;

        let pos = 0;
        for (let i = 0; i < 16; i++) {
            if (array[i] == 0) {
                pos = i;

                while (pos != 15) {
                    let a = tempSquare[pos];
                    let b = tempSquare[pos + 1];

                    tempSquare[pos] = b;
                    tempSquare[pos + 1] = a;

                    pos++;
                }
                break;
            }
        }

        return tempSquare;
    }

    function isPositionPossible(square) {
        let stringified = (square + "").replace(/,/g, " ").split(" ");
        let map = new Map();


        for (let i = 0; i < stringified.length; i++) {
            if (parseInt(stringified[i]) == 0) continue;
            let amountStoredToRight = 0;

            for (let j = i; j < stringified.length; j++) {
                if (parseInt(stringified[j]) == 0) continue;
                if (parseInt(stringified[j]) < parseInt(stringified[i])) {
                    amountStoredToRight++;
                }
            }
            map.set(stringified[i], amountStoredToRight);
        }

        let finalVal = 0;
        map.forEach((value, key) => {
            finalVal += value;
        });

        return (finalVal % 2) == 0;
    }


    // http://stackoverflow.com/questions/962802#962890
    function shuffle(array) {
        var tmp, current, top = array.length;
        if (top) while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
        return array;
    }

    function fillArray() {
        for (let i = 0; i < 16; i++) {
            array[i] = i;
        }
    }

    const squareWidth = 100;
    const squareHeight = 100;
    const offsetFromLeftScreenEdge = 100;

    function update() {
        const canvas = document.getElementById("canvas");
        /**
         * @type CanvasRenderingContext2D
         */
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 0; i <= 4; i++) {
            for (let j = 0; j <= 4; j++) {
                ctx.beginPath();
                ctx.font = "30px Arial"

                ctx.strokeRect(offsetFromLeftScreenEdge, 0, i * squareWidth, j * squareHeight);
                ctx.closePath();
            }
        }

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let toDraw = array[i * 4 + j];

                if (toDraw == 0) continue;

                ctx.fillText(toDraw, squareWidth + 50 + (j * squareWidth), 90 * i + 90);
            }
        }

        ctx.fillText("Moves: " + parseInt(moves), 300, 500)

        if (arraysMatch(array, winningSquare)) {
            alert("YOU WIN")
        }
    }

    function addCanvasClick() {
        document.getElementById("canvas").addEventListener("click", event => {
            const xClick = event.clientX;
            const yClick = event.clientY;

            const row = Math.floor(yClick / squareHeight);
            const col = Math.floor((xClick - offsetFromLeftScreenEdge) / squareWidth);

            moveToEmptySquare(row, col)
        });
    }

    function arraysMatch(arr1 = [], arr2 = []) {
        if (arr1.length !== arr2.length) return false;

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }

        return true;
    }

    let moves = 0;
    let successfullyMoved = false;

    function moveToEmptySquare(row, col) {

        //otherwise it will be one row too many
        let emptySquareRow = -1;

        let emptySquareCol = 0;


        for (let i = 0; i < array.length; i++) {
            if (i % 4 == 0) emptySquareRow++;
            if (array[i] == 0) {
                emptySquareCol = i % 4;
                break;
            }
        }

        const clickedPos = row * 4 + col;
        const emptyPos = emptySquareRow * 4 + emptySquareCol;

        //can probably be cleaned up

        successfullyMoved = false;

        //prevents diagonal movement
        if (Math.hypot(row - emptySquareRow, col - emptySquareCol) == 1) {
            
            //if same column clicked, add or remove 4 to get the square directly above or below the clicked square.
            if (emptySquareCol == col) {

                let oldPos = array[clickedPos];

                if (clickedPos > emptyPos) {
                    let b = array[clickedPos - 4];

                    array[clickedPos] = b;
                    array[clickedPos - 4] = oldPos;

                    successfullyMoved = true;
                } else {
                    let b = array[clickedPos + 4];

                    array[clickedPos] = b;
                    array[clickedPos + 4] = oldPos;

                    successfullyMoved = true;
                }
            }

            //if same row clicked, add or remove 1 to get the square directly before or after the clicked square.
            if (emptySquareRow == row) {
                let oldPos = array[clickedPos];

                if (clickedPos > emptyPos) {
                    let b = array[clickedPos - 1];
                    array[clickedPos] = b;
                    array[clickedPos - 1] = oldPos;

                    successfullyMoved = true;
                } else {
                    let b = array[clickedPos + 1];

                    array[clickedPos] = b;
                    array[clickedPos + 1] = oldPos;

                    successfullyMoved = true;
                }
            }
        }

        if (successfullyMoved) {
            moves++;
        }

        update();
    }

    function createGame() {
        fillArray();
        array = shuffle(array);

        const tempFixedPosition = repositionEmptyPosition();
        if (!isPositionPossible(tempFixedPosition)) return createGame();
        update();
        addCanvasClick();

        return;
    }

    createGame();
}());