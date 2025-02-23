import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BehaviorSubject, delay, of } from 'rxjs';

type Player = 'X' | 'O' | null;
type Board = Player[][];

@Component({
  selector: 'app-tick-tack-toe',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './tick-tack-toe.component.html',
  styleUrls: ['./tick-tack-toe.component.scss'],
})
export class TickTackToeComponent implements OnInit {
  private readonly boardSize = 3;
  board$ = new BehaviorSubject<Board>(this.createEmptyBoard());
  gameStarted$ = new BehaviorSubject<boolean>(false);
  currentPlayer$ = new BehaviorSubject<Player>('X');
  winner$ = new BehaviorSubject<Player>(null);
  firstMoveMessage$ = new BehaviorSubject<string>(''); // New state for first move banner
  private previousWinner: Player = null;
  welcomeMessage = 'Welcome to Elite Tic-Tac-Toe';

  ngOnInit(): void {
    this.resetGame(false);
  }

  startGame(): void {
    this.resetGame(true);
  }

  makeMove(row: number, col: number): void {
    if (
      !this.gameStarted$.value ||
      this.winner$.value ||
      this.board$.value[row][col]
    )
      return;

    const board = this.cloneBoard(this.board$.value);
    board[row][col] = this.currentPlayer$.value;
    this.board$.next(board);

    this.checkGameState(() => {
      if (!this.winner$.value && this.currentPlayer$.value === 'X') {
        this.currentPlayer$.next('O');
        this.computerMove();
      }
    });
  }

  private computerMove(): void {
    of(this.findBestMove(this.board$.value))
      .pipe(delay(800))
      .subscribe(({ row, col }) => {
        const board = this.cloneBoard(this.board$.value);
        board[row][col] = 'O';
        this.board$.next(board);
        this.checkGameState(() => {
          if (!this.winner$.value) this.currentPlayer$.next('X');
        });
      });
  }

  private checkGameState(callback: () => void): void {
    const board = this.board$.value;
    const winner = this.checkForWin(board);

    if (winner) {
      this.winner$.next(winner);
      this.previousWinner = winner;
      setTimeout(
        () =>
          this.announceResult(
            winner === 'X' ? 'Player X Wins!' : 'AI (O) Wins!'
          ),
        500
      );
    } else if (this.isBoardFull(board)) {
      this.winner$.next(null);
      this.previousWinner = null;
      setTimeout(() => this.announceResult("It's a Tie!"), 500);
    } else {
      callback();
    }
  }

  private findBestMove(board: Board): { row: number; col: number } {
    let bestScore = -Infinity;
    let move: { row: number; col: number } = { row: 0, col: 0 };

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (!board[i][j]) {
          board[i][j] = 'O';
          const score = this.minimax(board, 0, false);
          board[i][j] = null;
          if (score > bestScore) {
            bestScore = score;
            move = { row: i, col: j };
          }
        }
      }
    }
    return move;
  }

  private minimax(board: Board, depth: number, isMaximizing: boolean): number {
    const winner = this.checkForWin(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (this.isBoardFull(board)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (!board[i][j]) {
            board[i][j] = 'O';
            bestScore = Math.max(
              bestScore,
              this.minimax(board, depth + 1, false)
            );
            board[i][j] = null;
          }
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < this.boardSize; i++) {
        for (let j = 0; j < this.boardSize; j++) {
          if (!board[i][j]) {
            board[i][j] = 'X';
            bestScore = Math.min(
              bestScore,
              this.minimax(board, depth + 1, true)
            );
            board[i][j] = null;
          }
        }
      }
      return bestScore;
    }
  }

  private checkForWin(board: Board): Player {
    const lines = [
      ...board,
      ...Array.from({ length: this.boardSize }, (_, i) =>
        board.map((row) => row[i])
      ),
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
      if (line.every((cell) => cell === 'X')) return 'X';
      if (line.every((cell) => cell === 'O')) return 'O';
    }
    return null;
  }

  private isBoardFull(board: Board): boolean {
    return board.every((row) => row.every((cell) => cell !== null));
  }

  private createEmptyBoard(): Board {
    return Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(null));
  }

  private cloneBoard(board: Board): Board {
    return board.map((row) => [...row]);
  }

  private resetGame(start: boolean): void {
    this.board$.next(this.createEmptyBoard());
    this.gameStarted$.next(start);
    this.winner$.next(null);

    if (start) {
      let starter: Player;
      if (this.previousWinner) {
        starter = this.previousWinner;
      } else {
        starter = Math.random() < 0.5 ? 'X' : 'O';
      }
      this.currentPlayer$.next(starter);
      this.firstMoveMessage$.next(
        starter === 'X' ? 'Player X Takes the Lead' : 'AI (O) Strikes First'
      );

      if (starter === 'O') {
        setTimeout(() => this.computerMove(), 800);
      }
    } else {
      this.currentPlayer$.next('X');
      this.firstMoveMessage$.next('');
    }
  }

  private announceResult(message: string): void {
    alert(message);
    this.startGame();
  }
}
