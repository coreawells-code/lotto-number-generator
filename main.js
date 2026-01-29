// DOM Elements
const choiceButtons = document.querySelectorAll('.choice-btn');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const resultMessageEl = document.getElementById('result-message');
const playerChoiceIconEl = document.getElementById('player-choice-icon');
const computerChoiceIconEl = document.getElementById('computer-choice-icon');

// Game state
let playerScore = 0;
let computerScore = 0;
const choices = ['rock', 'paper', 'scissors'];
const choiceIcons = {
    rock: '✊',
    paper: '🖐️',
    scissors: '✌️'
};

// Add event listeners to buttons
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.dataset.choice;
        playRound(playerChoice);
    });
});

function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = getResult(playerChoice, computerChoice);

    updateScores(result);
    updateUI(result, playerChoice, computerChoice);
}

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function getResult(player, computer) {
    if (player === computer) {
        return 'draw';
    } else if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

function updateScores(result) {
    if (result === 'win') {
        playerScore++;
    } else if (result === 'lose') {
        computerScore++;
    }
}

function updateUI(result, playerChoice, computerChoice) {
    // Update scores
    playerScoreEl.textContent = playerScore;
    computerScoreEl.textContent = computerScore;

    // Update choice icons
    playerChoiceIconEl.textContent = choiceIcons[playerChoice];
    computerChoiceIconEl.textContent = choiceIcons[computerChoice];

    // Update result message and color
    resultMessageEl.classList.remove('win', 'lose', 'draw');
    switch (result) {
        case 'win':
            resultMessageEl.textContent = '이겼습니다! 🎉';
            resultMessageEl.classList.add('win');
            break;
        case 'lose':
            resultMessageEl.textContent = '졌습니다... 😢';
            resultMessageEl.classList.add('lose');
            break;
        case 'draw':
            resultMessageEl.textContent = '비겼습니다! 🤝';
            resultMessageEl.classList.add('draw');
            break;
    }
}
