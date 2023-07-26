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
let originalTargetWord = ''; // Store the original target word
let targetWord = '';
let inputFields = []; // Declare the inputFields array outside the startGame function

function startGame() {
    fetch('company_names.txt')
        .then(response => response.text())
        .then(data => {
            const brandNames = data.trim().split('\n');

            // Randomly select a brand name from the list
            originalTargetWord = brandNames[Math.floor(Math.random() * brandNames.length)].trim();
            targetWord = originalTargetWord; // Set targetWord to the original word initially

            // Clear the input fields from any previous games
            wordInputsContainer.innerHTML = '';

            // Create a single text box for the user to enter the entire word
            const input = document.createElement('input');
            input.type = 'text';
            input.pattern = '[a-zA-Z- ]*'; // Restrict input to English alphabet letters, spaces, and hyphens
            input.placeholder = 'Enter the brand name';
            input.autocomplete = 'off'; // Turn off autocomplete for the input field

            // Set the size attribute to be 4 times the length of the originalTargetWord
            const wordLength = originalTargetWord.length;
            const size = wordLength * 4; // Make it 4 times longer
            input.size = size;

            wordInputsContainer.appendChild(input);

            // Enable the Check button and set lives to 3 for a new game
            checkButton.disabled = false;
            lives = 3;
            remainingLives.textContent = lives;

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

function checkWord() {
    if (lives <= 0) {
        // If lives are already 0, do nothing and prevent further guesses
        return;
    }

    const userInput = inputFields[0].value.trim();

    if (userInput === originalTargetWord) {
        resultMessage.textContent = 'Correct!';
        resultMessage.style.color = 'green';
        checkButton.disabled = true;
    } else {
        resultMessage.textContent = 'Try again!';
        resultMessage.style.color = 'red';
        lives--;
        remainingLives.textContent = lives;

        if (lives <= 0) {
            // No more lives left, reveal the answer
            checkButton.disabled = true;
            inputFields[0].disabled = true;

            // Show the hyphens and spaces correctly in the answer
            const visibleAnswer = originalTargetWord
                .split('')
                .map((char, index) => {
                    return userInput[index] !== ' ' ? char : ' ';
                })
                .join('');

            resultMessage.textContent = `You lost! The brand name was "${visibleAnswer}".`;
        }
    }

    // Clear the input field after checking
    inputFields[0].value = '';

    // Remove focus from the input field
    inputFields[0].blur();

    // Update the inputFields array with the latest input field
    inputFields[0] = document.querySelector('#word-inputs input');
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

function handleKeyboardInput(key) {
    // Get the focused input field (only one input field in this case)
    const focusedInput = document.querySelector('#word-inputs input');

    // Check if the focused element is an input field
    if (focusedInput.tagName === 'INPUT') {
        if (key === 'Backspace') {
            // Handle the "Backspace" button press
            focusedInput.value = focusedInput.value.slice(0, -1);
        } else if (key === 'Enter') {
            // Handle the "Enter" button press (optional)
            // You can add specific behavior for the "Enter" button if needed
            // For this game, we are not using "Enter" functionality
        } else {
            // Append the pressed key to the focused input field
            focusedInput.value += key.toLowerCase();
        }

        // Update the inputFields array with the updated input field
        inputFields[0] = focusedInput;
    }

    // Trigger the 'input' event on the input field to update the state
    const inputEvent = new Event('input', { bubbles: true });
    focusedInput.dispatchEvent(inputEvent);
}

// Add event listener for external keyboard input (keypress)
document.addEventListener('keypress', handleExternalKeyboardInput);

function handleExternalKeyboardInput(event) {
    const currentInput = event.target;
    const currentValue = currentInput.value;

    if (currentValue) {
        // If the input field has a value (i.e., a character is entered via the external keyboard)
        const currentIndex = inputFields.indexOf(currentInput);

        // Set focus on the next input field (if available)
        if (currentIndex < inputFields.length - 1) {
            inputFields[currentIndex + 1].focus();
        }
    }
}