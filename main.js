import { Chess } from "/node_modules/chess.js/dist/chess.js";

var game;
var startingFEN;

var board = Chessboard("myBoard", {
  draggable: true,
  position: "start",
  onDrop: onDrop,
  onDragStart: onDragStart,
  onSnapEnd: onSnapEnd,
});

function resetBoard() {
  game.load(startingFEN);
  board.position(game.fen());
}
function showSolution() {
  document.getElementById("solution").hidden = false;
}

document.getElementById("reset").addEventListener("click", resetBoard);
document.getElementById("showSolution").addEventListener("click", showSolution);

function onDragStart(source, piece, position, orientation) {
  if (game.isGameOver()) return false;
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function onDrop(source, target, piece, newPos, oldPos, orientation) {
  try {
    var move = game.move({
      from: source,
      to: target,
    });
  } catch (error) {
    return "snapback";
  }
}

function onSnapEnd() {
  board.position(game.fen());
}

fetch("https://api.chess.com/pub/puzzle/random")
  .then((response) => {
    console.log(response);
    if (!response.ok) {
      throw Error("Error");
    }
    return response.json();
  })
  .then((data) => {
    startingFEN = data.fen;
    console.log(data);
    game = new Chess(data.fen);
    board.position(data.fen);
    console.log(data.pgn);
    document.getElementById("solution").innerHTML = data.pgn;
  })
  .catch((error) => {
    console.log(error);
  });
