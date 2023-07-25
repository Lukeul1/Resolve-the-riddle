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
            const words = targetWord.split(/(\s|-)/); // Split the targetWord by spaces and hyphens

            // Update the riddle text without revealing the targetWord
            riddleElement.innerHTML = '<strong>Riddle:</strong> Guess the brand name.';

            // Create input fields for each character of each word
            words.forEach(word => {
                if (word === ' ' || word === '-') {
                    // Create a space or hyphen element
                    const spaceOrHyphen = document.createElement('span');
                    spaceOrHyphen.textContent = word;
                    wordInputsContainer.appendChild(spaceOrHyphen);
                } else {
                    // Create input fields for each character in the word
                    for (let i = 0; i < word.length; i++) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.maxLength = 1;
                        input.pattern = '[a-zA-Z-]'; // Restrict input to English alphabet letters and hyphens
                        wordInputsContainer.appendChild(input);

                        // Add the event listener for the 'input' event on each input field
                        input.addEventListener('input', handleExternalKeyboardInput);
                    }
                }
            });

            // Enable the Check button and set lives to 3 for a new game
            checkButton.disabled = false;
            lives = 3;
            remainingLives.textContent = lives;

            // Move focus to the first input field
            inputFields = Array.from(wordInputsContainer.children).filter(input => input.tagName === 'INPUT' || input.tagName === 'SPAN'); // Assign the inputFields here
            inputFields.find(input => input.tagName === 'INPUT').focus(); // Focus on the first input field

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

    // Create an array to store the user's guess for each word
    const userWordArray = [];
    let currentIndex = 0;

    inputFields.forEach((input, index) => {
        if (input.tagName === 'INPUT') {
            const inputValue = input.value.trim();
            input.value = ''; // Clear the input field

            // If the input is not empty, add it to the userWordArray for the corresponding word
            if (inputValue) {
                userWordArray[currentIndex] = inputValue.toLowerCase();
            } else {
                // If the input field is empty, add a space or a hyphen between words as needed
                userWordArray[currentIndex] = originalTargetWord[index] === '-' ? '-' : ' ';
            }

            // Move to the next word when a space is encountered
            if (originalTargetWord[index] === ' ') {
                currentIndex++;
            }
        } else {
            // If the current input is a span element (space or hyphen), add it to the userWordArray
            userWordArray[currentIndex] = originalTargetWord[index];
        }
    });

    // Concatenate the userWordArray to form the user's complete guess
    const userWord = userWordArray.join('');

    if (userWord === originalTargetWord.toLowerCase()) {
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

            // Disable input fields after the game is over (lives = 0)
            inputFields.forEach(input => {
                if (input.tagName === 'INPUT') {
                    input.disabled = true;
                }
            });

            // Show the hyphens and spaces correctly in the answer
            const visibleAnswer = originalTargetWord
                .split('')
                .map((char, index) => {
                    if (inputFields[index].tagName === 'INPUT') {
                        return inputFields[index].value !== '' ? char : ' ';
                    } else {
                        return char === '-' ? '-' : ' ';
                    }
                })
                .join('');

            // Replace the placeholder " " with the actual brand name
            const actualBrandName = originalTargetWord.replace(/-/g, ' ');
            resultMessage.textContent = `You lost! The brand name was "${actualBrandName}".`;
        }
    }

    // Remove focus from the input fields
    inputFields.forEach(input => {
        if (input.tagName === 'INPUT') {
            input.blur();
        }
    });
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
                const currentValue = lastNonEmptyInput.value;
                lastNonEmptyInput.value = currentValue.slice(0, -1); // Remove the last character
                lastNonEmptyInput.focus(); // Set focus back to the last non-empty input field
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