import React from "react";
import "./App.css";

var choice;

function Square(props) {
  return (
    <button className={props.style} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

function ScoreBoard(props) {
  return (
    <div className="row">
      <div className="leftScore">
        <h1>X: {props.xWins}</h1>
      </div>
      <div className="rightScore">
        {" "}
        <h1>O: {props.oWins} </h1>
      </div>
    </div>
  );
}

function renderSquare(props, i, type) {
  return (
    <Square
      style={type}
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  );
}

function Board(props) {
  return (
    <div>
      <div className="board-row">
        {renderSquare(props, 0, "squareTopLeft")}
        {renderSquare(props, 1, "squareTopCenter")}
        {renderSquare(props, 2, "squareTopRight")}
      </div>
      <div className="board-row">
        {renderSquare(props, 3, "squareCenterLeft")}
        {renderSquare(props, 4, "squareCenterCenter")}
        {renderSquare(props, 5, "squareCenterRight")}
      </div>
      <div className="board-row">
        {renderSquare(props, 6, "squareBottomLeft")}
        {renderSquare(props, 7, "squareBottomCenter")}
        {renderSquare(props, 8, "squareBottomRight")}
      </div>
    </div>
  );
}

function ChoosePlayerMenu(props) {
  return (
    <div className="text-center">
      <h1>Player 1. Which do you want to play with?</h1>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button className="btn btn-info" onClick={props.chooseX}>
          X
        </button>
        <button className="btn btn-danger" onClick={props.chooseO}>
          O
        </button>
      </div>
    </div>
  );
}

function ChooseAdversaryMenu(props) {
  return (
    <div className="text-center">
      <h1>How many Players?</h1>
      <div className="btn-group" role="group" aria-label="Basic example">
        <button className="btn btn-info" onClick={props.choose1}>
          ONE PLAYER
        </button>
        <button className="btn btn-danger" onClick={props.choose2}>
          TWO PLAYERS
        </button>
      </div>
    </div>
  );
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      player1: null,
      player2: null,
      isComputer: null,
      xIsNext: true,
      xWins: 0,
      oWins: 0,
    };
  }

  isGameComplete(squares) {
    return squares.find((x) => x === null) === undefined ? true : false;
  }

  resetGame(winner) {
    this.setState(
      {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        stepNumber: 0,
        xWins: winner === "X" ? this.state.xWins + 1 : this.state.xWins,
        oWins: winner === "O" ? this.state.oWins + 1 : this.state.oWins,
      },
      () => this.handleComputer(this.state.history[0].squares)
    );
  }

  resetGameScore() {
    this.setState(
      {
        history: [
          {
            squares: Array(9).fill(null),
          },
        ],
        stepNumber: 0,
        xIsNext: true,
        xWins: 0,
        oWins: 0,
      },
      () => this.handleComputer(this.state.history[0].squares)
    );
  }

  choosePlayer(isComputer) {
    this.setState({ isComputer: isComputer });
  }

  chooseSymbol(symbol) {
    let player2 = symbol === "X" ? "O" : "X";
    this.setState({ player1: symbol, player2: player2 });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  getNextPlayer() {
    let symbol = this.state.xIsNext ? this.state.player1 : this.state.player2;

    return symbol;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const squares = current.squares.slice();

    if (squares[i]) {
      return;
    }

    squares[i] = this.getNextPlayer();

    this.setState(
      (prevState, props) => {
        return {
          history: history.concat([
            {
              squares: squares,
            },
          ]),
          stepNumber: history.length,
          xIsNext: !prevState.xIsNext,
        };
      },
      () => this.handleComputer(squares)
    );
  }

  handleComputer(squares) {
    if (this.isGameComplete(squares)) {
      this.resetGame();
      return;
    }

    const winner = calculateWinner(squares);
    if (winner) {
      this.resetGame(winner);
      return;
    }

    if (this.state.isComputer === 1 && !this.state.xIsNext) {
      this.minimax(squares.slice(), this.state.xIsNext, 0);
      this.handleClick(choice);
    }
  }

  minimax(squares, turn, depth) {
    let winner = calculateWinner(squares);
    if (winner) return winner === this.state.player1 ? depth - 10 : 10 - depth;

    if (this.isGameComplete(squares)) return 0;

    let scores = [];
    let moves = [];
    depth += 1;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        let possible_game = squares.slice();
        possible_game[i] = turn ? this.state.player1 : this.state.player2;
        scores.push(this.minimax(possible_game, !turn, depth));
        moves.push(i);
      }
    }

    if (!turn) {
      let maxIndex = indexOfMax(scores);
      choice = moves[maxIndex];
      return scores[maxIndex];
    } else {
      let minIndex = indexOfMin(scores);
      choice = moves[minIndex];
      return scores[minIndex];
    }
  }

  render() {
    if (!(this.state.isComputer === 1 || this.state.isComputer === 2)) {
      return (
        <div className="flexcontainer">
          <ChooseAdversaryMenu
            choose1={() => this.choosePlayer(1)}
            choose2={() => this.choosePlayer(2)}
          >
            {" "}
          </ChooseAdversaryMenu>
        </div>
      );
    }

    if (!this.state.player1) {
      return (
        <div className="flexcontainer">
          <ChoosePlayerMenu
            chooseX={() => this.chooseSymbol("X")}
            chooseO={() => this.chooseSymbol("O")}
          >
            {" "}
          </ChoosePlayerMenu>
        </div>
      );
    }
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = (this.state.xIsNext ? "Player 1 " : "Player 2") + " turn";
    }

    return (
      <div className="game flexcontainer">
        <div className="row">
          <div className="col">
            <div className="game-board">
              <ScoreBoard xWins={this.state.xWins} oWins={this.state.oWins} />
              <div className="row">
                <div className="col text-center">{status}</div>
              </div>
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
              <div className="row">
                <div className="col text-center">
                  <button
                    className="btn btn-danger deleteBtn btn-block"
                    onClick={() => this.resetGameScore()}
                  >
                    Restart Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function indexOfMin(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var min = arr[0];
  var minIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      minIndex = i;
      min = arr[i];
    }
  }

  return minIndex;
}

function indexOfMax(arr) {
  if (arr.length === 0) {
    return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      maxIndex = i;
      max = arr[i];
    }
  }

  return maxIndex;
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
