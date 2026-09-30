const cells = Array.from(document.querySelectorAll('[data-cell]'));
const statusText = document.querySelector('#game-status');
const roundLabel = document.querySelector('#round-label');
const resetButton = document.querySelector('#reset-button');
const xScoreText = document.querySelector('#x-score');
const oScoreText = document.querySelector('#o-score');

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let round = 1;
let scores = { X: 0, O: 0 };
let roundOver = false;

function playTurn(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);

  if (roundOver || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.dataset.mark = currentPlayer;
  cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')}, ${currentPlayer}`);

  const winningLine = winningLines.find(line => line.every(position => board[position] === currentPlayer));
  if (winningLine) {
    roundOver = true;
    scores[currentPlayer] += 1;
    winningLine.forEach((position, animationOrder) => {
      cells[position].style.setProperty('--win-order', animationOrder);
      cells[position].classList.add('is-winning');
    });
    updateScores();
    statusText.textContent = `${currentPlayer} wins!`;
    statusText.dataset.winner = currentPlayer;
    statusText.classList.add('is-winner');
    return;
  }

  if (board.every(Boolean)) {
    roundOver = true;
    statusText.textContent = "It's a draw!";
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `${currentPlayer}'s turn`;
}

function updateScores() {
  xScoreText.textContent = scores.X;
  oScoreText.textContent = scores.O;
}

function startNewRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  roundOver = false;
  round += 1;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;
    cell.textContent = '';
    delete cell.dataset.mark;
    cell.style.removeProperty('--win-order');
    cell.classList.remove('is-winning');
    cell.setAttribute('aria-label', `Row ${row}, column ${column}`);
  });

  statusText.textContent = "X's turn";
  statusText.classList.remove('is-winner');
  delete statusText.dataset.winner;
  roundLabel.textContent = `ROUND ${String(round).padStart(2, '0')}`;
  cells[0].focus();
}

cells.forEach(cell => cell.addEventListener('click', playTurn));
resetButton.addEventListener('click', startNewRound);