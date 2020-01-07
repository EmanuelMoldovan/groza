<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="reset()" outlined>Reset</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <div v-if="checkWinner()">The winner is {{checkWinner()}}</div>
    </v-row>

    <v-row v-for="(row, i) in board" :key="i" align="center" justify="center">
      <v-col v-for="(col, j) in row" :key="j">
        <v-card @click="onBoxClick(i, j)" tile height="150" width="150" class="text-center center">
            <v-icon size="80">{{col === 'x' ? 'fas fa-times' : col === '0' ? 'far fa-circle' : ''}}</v-icon>         
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data() {
    return {
      board: ['', '', '', '', '', '', '', '', ''],
      human: '',
      scores: {
        x: 1,
        0: -1,
        tie: 0
      }
    }
  },

  created() {    
    this.human = '0';
    this.playBot();
  },

  computed: {
    bot() {
      if (this.human === 'x') {
        return '0';
      } else if (this.human === '0') {
        return 'x';
      }

      return '';
    },

    availableSpaces() {
      for (let i = 0; i < this.board.length; i ++) {
        if (this.board[i] === '') {
          return true;
        }
      }

      return false;
    }
  },

  methods: {
    onBoxClick(i, j) { 
      if (this.board[i] !== '') return;
      this.board[i] = this.human;
      //this.setBox(i, j, this.human);   
      if (this.checkWinner() === null) {
        this.playBot();
      } else {
        return;
      }      
    },

    setBox(i, player) {
      const newRow = this.board[i].slice(0)
      newRow = player
      this.$set(this.board, i, newRow);
    },

    equals3(a, b, c) {
      return a === b && b === c && a !== '';
    },

    checkWinner() {
      let winner = null;
      for (let i = 0; i < this.board.length; i++) {
        if (this.equals3(this.board[i][0], this.board[i][1], this.board[i][2])) {
          winner = this.board[i][0];
        }
      }

      for (let i = 0; i < this.board.length; i++) {
        if (this.equals3(this.board[0][i], this.board[1][i], this.board[2][i])) { 
          winner = this.board[0][i];
        }
      }

      if (this.equals3(this.board[0][0], this.board[1][1], this.board[2][2])) { 
        winner = this.board[0][0];
      }

      if (this.equals3(this.board[0][2], this.board[1][1], this.board[2][0])) { 
        winner = this.board[0][2];
      }

      if (winner === null && !this.availableSpaces ) {
        return 'tie';
      } else {
        return winner;
      }
    },

    reset() {
      this.board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ];

      this.human = '0'; 
      
      this.playBot();
    },

    playBot() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < this.board.length; i ++) {
        for (let j = 0; j < this.board.length; j ++) {
          if (this.board[i] === '') {
            this.board[i] = this.bot;
            let score = this.minimax(this.board, 0, false);
            this.board[i] = '';
            if (score > bestScore) {
              bestScore = score;
              move = {i, j};
            }
          }
        }
      }
      //this.setBox(move.i, move.j, this.bot);
      this.board[move.i][move.j] = this.bot;
    },

    minimax(board, depth, isMaximizing) {
      const winner = this.checkWinner();
      if (winner !== null) {
        let score = this.scores[winner];
        return score;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < this.board.length; i ++) {
          for (let j = 0; j < this.board.length; j ++) {
            if (board[i] === '') {
              board[i] = this.bot;
              let score = this.minimax(board, depth + 1, false);
              board[i] = '';
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < this.board.length; i ++) {
          for (let j = 0; j < this.board.length; j ++) {
            if (board[i] === '') {
              board[i] = this.human;
              let score = this.minimax(board, depth + 1, true);
              board[i] = '';
              bestScore = Math.min(score, bestScore);
            }
          }
        }
        return bestScore;
      }
    }
  }

}
</script>

<style>
.center {
  line-height: 150px;
}
</style>
