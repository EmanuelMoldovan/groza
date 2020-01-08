const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

var board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];
var bot = 'x';
var human = '0';
var scores = {
    x: 10,
    0: -10,
    tie: 0
}

function playBot() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = bot;
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    board[move.i][move.j] = bot;
}

function availableSpaces() {
    return board.some(row => {
        return row.some(cell => cell === '');
    });
}

function equals3(a, b, c) {
    return a === b && b === c && a !== '';
}

function checkWinner() {
    let winner = null;
    for (let i = 0; i < 3; i++) {
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }

    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }

    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }

    if (equals3(board[0][2], board[1][1], board[2][0])) {
        winner = board[0][2];
    }

    if (winner === null && !availableSpaces()) {
        return 'tie';
    } else {
        return winner;
    }
}

function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    const winner = checkWinner();
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = bot;
                    let score = minimax(board, depth + 1, false, alpha, beta);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);                    
                    if (beta >= alpha) {
                        return bestScore;
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true, alpha, beta);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (alpha >= beta) {
                        return bestScore;
                    }
                }
            }
        }
        return bestScore;
    }
}

function printGameBoard() {
    // board.map((row, index) => {
    //     if (index == 0) {
    //         console.log(`     0   1   2  `);
    //         console.log(`${index}`, row);
    //     } else {
    //         console.log(`${index}`, row);
    //     }
    // })

    console.table(board);
}

const question = () => {
    return new Promise((resolve, reject) => {
        readline.question(`What's your move? (eg: 1:2): `, (move) => {
            let positions = move.split(':');
            const row = Number(positions[0]);
            const col = Number(positions[1]);
            board[row][col] = human;
            printGameBoard();  
            resolve();     
        }); 
    })
  }

async function main() {
    playBot();
    printGameBoard();

    while(!checkWinner()) {
        await question();
        playBot(); 
        printGameBoard();
    }    
    
    console.log(checkWinner() !== 'tie' ? `The winner is ${checkWinner()}` : `It is ${checkWinner()}`);
    readline.close() 

}

main();

