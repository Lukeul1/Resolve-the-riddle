// Get the necessary elements from the HTML
const wordInputsContainer = document.getElementById('word-inputs');
const checkButton = document.getElementById('check-button');
const resultMessage = document.getElementById('result-message');
const remainingLives = document.getElementById('remaining-lives');
const riddleElement = document.createElement('p');
riddleElement.id = 'riddle';
riddleElement.innerHTML = '<strong>Riddle:</strong> Guess the brand name.';
document.getElementById('result-container').insertBefore(riddleElement, document.getElementById('how-to-play'));

let lives = 3;
let targetWord = '';
let inputFields = []; // Declare the inputFields array outside the startGame function

// Function to fetch the brand names from the 'company_names.txt' file and start the game
function startGame() {
    fetch('company_names.txt')
        .then(response => response.text())
        .then(data => {
            const brandNames = data.trim().split('\n');

            // Randomly select a brand name from the list
            targetWord = brandNames[Math.floor(Math.random() * brandNames.length)].trim();

            // Remove the colon (:) from the end of the word, if present
            targetWord = targetWord.replace(/:$/, '');

            // Update the riddle text
            riddleElement.innerHTML = '<strong>Riddle:</strong> Guess the brand name.';

            // Clear the input fields from any previous games
            wordInputsContainer.innerHTML = '';
            const maxLength = targetWord.length;
            for (let i = 0; i < maxLength; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.pattern = '[a-zA-Z]'; // Restrict input to English alphabet letters only
                wordInputsContainer.appendChild(input);
            }

            // Enable the Check button and set lives to 3 for a new game
            checkButton.disabled = false;
            lives = 3;
            remainingLives.textContent = lives;

            // Move focus to the first input field
            inputFields = Array.from(wordInputsContainer.children); // Assign the inputFields here
            inputFields[0].focus();

            // Clear the previous result message and re-enable the check button
            resultMessage.textContent = '';
            resultMessage.style.color = '';
        })
        .catch(error => {
            console.error('Error fetching the brand names:', error);
        });
}

// Call the function to start the game when the page loads
document.addEventListener('DOMContentLoaded', startGame);

// Add event listener to the Check button
checkButton.addEventListener('click', checkWord);

// Function to handle the word checking logic
function checkWord() {
    const userWord = inputFields
        .map(input => {
            const inputValue = input.value.toLowerCase();
            input.value = ''; // Clear the input field
            return inputValue;
        })
        .join('');

    if (userWord === targetWord.toLowerCase()) {
        resultMessage.textContent = 'Correct!';
        resultMessage.style.color = 'green';
        checkButton.disabled = true;
    } else {
        resultMessage.textContent = 'Try again!';
        resultMessage.style.color = 'red';
        lives--;
        remainingLives.textContent = lives;
        inputFields.forEach((input, index) => {
            input.value = ''; // Clear the input fields
            if (index === 0) {
                input.focus(); // Set focus to the initial input field
            }
        });
        if (lives <= 0) {
            resultMessage.textContent = `You lost! The brand name was "${targetWord}".`;
            checkButton.disabled = true;
        }
    }

    // Remove focus from the input fields
    inputFields.forEach(input => input.blur());
}

// Define the on-screen keyboard keys
const keyboardKeys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    { type: 'special', keys: ['Enter', 'Backspace'] }, // Use an object to represent the "Enter" and "Backspace" buttons
];

// Create the on-screen keyboard dynamically
const keyboardContainer = document.getElementById('keyboard-container');
keyboardKeys.forEach(row => {
    const keyboardRow = document.createElement('div');
    keyboardRow.className = 'keyboard-row';
    if (Array.isArray(row)) {
        row.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.className = 'keyboard-key';
            keyButton.textContent = key;
            keyButton.addEventListener('click', () => handleKeyboardInput(key));
            keyboardRow.appendChild(keyButton);
        });
    } else if (row.type === 'special') {
        // For the special buttons, use a different class
        row.keys.forEach(key => {
            const keyButton = document.createElement('button');
            keyButton.className = 'keyboard-key-special'; // Use a different class for the "Enter" and "Backspace" buttons
            keyButton.textContent = key;
            keyButton.addEventListener('click', () => handleKeyboardInput(key));
            keyboardRow.appendChild(keyButton);
        });
    }
    keyboardContainer.appendChild(keyboardRow);
});

// Function to handle on-screen keyboard input
function handleKeyboardInput(key) {
    // Find the first empty input field
    const emptyInput = inputFields.find(input => input.value === '');
    const lastNonEmptyInput = inputFields.reduceRight((found, input) => found || (input.value !== '' && input), null);

    if (emptyInput) {
        if (key === 'Enter') {
            // Trigger the check when the Enter button is clicked
            checkWord();
        } else if (key === 'Backspace') {
            // If Backspace is clicked, remove the character from the last non-empty input field
            if (lastNonEmptyInput) {
                lastNonEmptyInput.value = '';
            }
        } else {
            const inputValue = key.toLowerCase();

            if (/^[a-zA-Z]$/.test(inputValue)) {
                // If the input is a letter, populate the empty input field
                emptyInput.value = inputValue;

                // Find the index of the current empty input field
                const currentIndex = inputFields.indexOf(emptyInput);

                // Set focus on the next input field (if available)
                if (currentIndex < inputFields.length - 1) {
                    inputFields[currentIndex + 1].focus();
                } else {
                    // Do not trigger the check automatically
                }
            }
        }
    }
}
