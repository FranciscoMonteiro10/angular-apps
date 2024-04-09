import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tick-tack-toe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tick-tack-toe.component.html',
  styleUrl: './tick-tack-toe.component.scss',
})
export class TickTackToeComponent implements OnInit {
  welcomeMsg: string = '';
  board: string[][] = [];
  gameStarted: boolean = false;

  currentPlayer: 'X' | 'O' = 'X';

  constructor() {}

  ngOnInit(): void {
    this.welcomeMsg = 'Welcome to my game!';
  }

  startGame(): void {
    this.board = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
    this.gameStarted = true;
  }

  addMove(x: number, y: number): void {
    if (!this.board[x][y] && this.currentPlayer === 'X') {
      this.board[x][y] = this.currentPlayer;
      if (this.checkForWin('X')) {
        alert('You win!');
        this.startGame();
        return;
      } else if (this.isBoardFull()) {
        alert("It's a tie!");
        this.startGame();
        return;
      }
      this.togglePlayer();
    }
  }

  togglePlayer(): void {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  makeMove(x: number, y: number): void {
    if (!this.board[x][y] && this.currentPlayer === 'X') {
      this.board[x][y] = 'X';

      setTimeout(() => {
        if (this.checkForWin('X')) {
          alert('You win!!');
          this.startGame();
        } else if (this.isBoardFull()) {
          alert("It's a tie");
          this.startGame();
        } else {
          this.currentPlayer = 'O';
          setTimeout(() => {
            this.computerMove();
          }, 1000);
        }
      });
    }
  }

  computerMove(): void {
    if (this.currentPlayer !== 'O') {
      return;
    }

    let availableMoves = [];
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (!this.board[i][j]) {
          availableMoves.push({ i, j });
        }
      }
    }

    if (availableMoves.length > 0) {
      const move =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
      this.board[move.i][move.j] = 'O';
    }
    setTimeout(() => {
      if (this.checkForWin('O')) {
        alert('Computer wins!');
        this.startGame();
      } else if (this.isBoardFull()) {
        alert("It's a tie");
        this.startGame();
      } else {
        this.currentPlayer = 'X';
      }
    });
  }

  checkForWin(symbol: 'X' | 'O'): boolean {
    for (let i = 0; i < 3; i++) {
      if (
        (this.board[i][0] === symbol &&
          this.board[i][1] === symbol &&
          this.board[i][2] === symbol) ||
        (this.board[0][i] === symbol &&
          this.board[1][i] === symbol &&
          this.board[2][i] === symbol)
      ) {
        return true;
      }
    }
    if (
      (this.board[0][0] === symbol &&
        this.board[1][1] === symbol &&
        this.board[2][2] === symbol) ||
      (this.board[0][2] === symbol &&
        this.board[1][1] === symbol &&
        this.board[2][0] === symbol)
    ) {
      return true;
    }
    return false;
  }

  isBoardFull(): boolean {
    return this.board.every((row) => row.every((cell) => cell !== ''));
  }
}
