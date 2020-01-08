const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

var board = [
    ['0', '0', '0', '0'],
    ['', '', '', ''],
    ['', '', '', ''],
    ['x', 'x', 'x', 'x']
];
var bot = 'x';
var human = '0';
var scores = {
    x: 10,
    0: -10,
    tie: 0
}
var botMoves = [
    {i: -1, j: 0}, {i: -1, j: 1}, {i: -1, j: -1}, {i: 0, j: -1}, {i: 0, j: 1}
]

var humanMoves = [
    {i: 1, j: 1}, {i: 1, j: 0}, {i: 1, j: -1}
];

function playerPieces(player) {
    let pieces = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === player) {
                pieces.push({i, j});
            }
        }
    }
    return pieces;
}

function checkBorders(i, j, m, player) {
    if (i + m.i >= 0 && i + m.i < 4) {
        if (j + m.j >= 0 && j + m.j < 4) {
            if (player === bot && i > 0) {
                return true;
            }
            
            if (player === human && i < 3) {
                return true;
            }
        }
    }
    return false;
}

function playBot() {
    let bestScore = -Infinity;
    let move;
    for (let piece of playerPieces(bot)) {
        const { i, j} = piece;
        for (let m of botMoves) {
            if (checkBorders(i, j, m, bot) && board[i + m.i][j + m.j] === '') {
                board[i + m.i][j + m.j] = bot;
                board[i][j] = '';
                let score = minimax(board, 0, false);                
                board[i + m.i][j + m.j] = '';
                board[i][j] = bot;
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j, m };
                }
            }
        }
    }
    if (move) {
        board[move.i + move.m.i][move.j + move.m.j] = bot;
        board[move.i][move.j] = '';
    }        
}

function checkWinner() {
    let winner = null;

    if (board[0].every(cell => cell === 'x')) {
        winner = 'x';
    }

    if (board[board.length - 1].every(cell => cell === '0')) {
        winner = '0';
    }
    return winner;
}

function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
    const winner = checkWinner();
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let piece of playerPieces(bot)) {
            const { i, j} = piece;
            for (let m of botMoves) {
                if (checkBorders(i, j, m, bot) && board[i + m.i][j + m.j] === '') {
                    board[i + m.i][j + m.j] = bot;
                    board[i][j] = '';
                    let score = minimax(board, depth + 1 , false);
                    board[i + m.i][j + m.j] = '';
                    board[i][j] = bot;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);                    
                    if (beta <= alpha) {
                        return bestScore;
                    }
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let piece of playerPieces(human)) {
            const { i, j} = piece;
            for (let m of humanMoves) {
                if (checkBorders(i, j, m, human) && board[i + m.i][j + m.j] === '') {
                    board[i + m.i][j + m.j] = human;
                    board[i][j] = '';
                    let score = minimax(board, depth + 1 , true);
                    board[i + m.i][j + m.j] = '';
                    board[i][j] = human;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (alpha <= beta) {
                        return bestScore;
                    }
                }
            }
        }
        //console.log('Min best move', bestScore);
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
        readline.question(`What's your move? (eg: 1:2->0): `, (move) => {
            let humanMove = move.split('->');
            let oldPosition = humanMove[0];
            let newPositions = humanMove[1];
            const row = Number(oldPosition.split(':')[0]);
            const col = Number(oldPosition.split(':')[1]);
            board[row][col] = '';
            board[row + humanMoves[Number(newPositions)].i][col + humanMoves[Number(newPositions)].j] = human;
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

