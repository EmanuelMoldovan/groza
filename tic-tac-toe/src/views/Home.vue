<template>
  <v-container>
    <v-row>
      <v-col>
        What do you want to be ?
      </v-col>

      <v-col>
        <v-radio-group v-model="human" row hide-details dense class="mt-0">
          <v-radio label="X" value="x"></v-radio>
          <v-radio label="0" value="0"></v-radio>
        </v-radio-group>
      </v-col>

      <v-col>
        <v-btn @click="reset()" outlined>Reset</v-btn>
        <v-btn @click="isStarted = true" class="primary">Start</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <div v-if="checkWinner()">The winner is {{checkWinner()}}</div>
    </v-row>

    <v-row v-for="(row, i) in board" :key="i" align="center" justify="center">
      <v-col v-for="(col, j) in row" :key="j">
        <v-card @click="onBoxClick(i, j)" tile height="150" width="150" class="text-center center" :disabled="!isStarted">
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
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      isStarted: false,
      human: '',
      scores: {
        x: 1,
        0: -1,
        tie: 0
      }
    }
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
        for (let j = 0; j < this.board.length; j ++) {
          if (this.board[i][j] === '') {
            return true;
          }
        }
      }

      return false;
    }
  },

  methods: {
    onBoxClick(i, j) { 
      if (this.board[i][j] !== '') return;
      this.setBox(i, j, this.human);   
      if (this.checkWinner() === null) {
        this.playBot();
      } else {
        return;
      }      
    },

    setBox(i, j, player) {
      const newRow = this.board[i].slice(0)
      newRow[j] = player
      this.$set(this.board, i, newRow);
      console.log(this.board);
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


      if (winner == null && !this.availableSpaces ) {
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

      this.human = '';
      this.isStarted = false;     
    },

    playBot() {
      let bestScore = -Infinity;
      let move;
      for (let i = 0; i < 3; i ++) {
        for (let j = 0; j < 3; j ++) {
          if (this.board[i][j] === '') {
            this.setBox(i, j, this.bot);
            let score = this.minimax(this.board.slice(0), 0, true);
            this.setBox(i, j, '');
            if (score > bestScore) {
              bestScore = score;
              move = {i, j};
            }
          }
        }
      }
      this.setBox(move.i, move.j, this.bot);
    },

    minimax(board, depth, isMaximizing) {
      const winner = this.checkWinner();
      if (winner !== null) {
        let score = this.scores[winner];
        return score;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i ++) {
          for (let j = 0; j < 3; j ++) {
            if (board[i][j] === '') {
              this.setBox(i, j, this.bot);
              let score = this.minimax(board, depth + 1, false);
              this.setBox(i, j, '');
              bestScore = Math.max(score, bestScore);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i ++) {
          for (let j = 0; j < 3; j ++) {
            if (board[i][j] === '') {
              this.setBox(i, j, this.human);
              let score = this.minimax(board, depth + 1, true);
              this.setBox(i, j, '');
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
