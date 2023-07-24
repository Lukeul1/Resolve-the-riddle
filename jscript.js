// Get the necessary elements from the HTML
const wordInputsContainer = document.getElementById('word-inputs');
const checkButton = document.getElementById('check-button');
const resultMessage = document.getElementById('result-message');
const remainingLives = document.getElementById('remaining-lives');
const synonymElement = document.createElement('p');
synonymElement.id = 'synonym';
document.getElementById('result-container').insertBefore(synonymElement, document.getElementById('how-to-play'));

let lives = 3;

// Function to fetch the brand names from the 'company_names.txt' file and start the game
function startGame() {
  fetch('company_names.txt')
    .then(response => response.text())
    .then(data => {
      const brandNames = data.trim().split('\n');

      // Randomly select a brand name from the list
      const targetWord = brandNames[Math.floor(Math.random() * brandNames.length)];
      const selectedSynonym = ''; // You can choose to include synonyms for the brand here

      synonymElement.textContent = `Synonym: ${selectedSynonym}`;

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
    })
    .catch(error => {
      console.error('Error fetching the brand names:', error);
    });
}

// Call the function to start the game when the page loads
startGame();

// Add event listener to the Check button
checkButton.addEventListener('click', checkWord);

// Add event listener to each input field
const inputFields = Array.from(wordInputsContainer.children);
inputFields.forEach((input, index) => {
  input.addEventListener('input', () => {
    if (input.value === '') {
      // If the input is empty, remain in the same input field
      input.blur();
    } else if (index < inputFields.length - 1) {
      inputFields[index + 1].focus();
    } else {
      checkButton.focus(); // Move focus to the Check button after the final input field
    }
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Backspace') {
      // Prevent default behavior of backspace key
      event.preventDefault();

      // Find the index of the current input field
      const currentIndex = inputFields.indexOf(input);

      // Clear the input field
      input.value = '';

      // Set focus back to the current input field
      input.focus();
    }
  });
});

// Function to handle the word checking logic
function checkWord() {
  const targetWord = document.getElementById('synonym').textContent.split(':')[1].trim();
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
