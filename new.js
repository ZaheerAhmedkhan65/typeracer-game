document.addEventListener('DOMContentLoaded', () => {
    const paragraphs = [
        "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
        "Call me Ishmael. Some years ago - never mind how long precisely - having little or no money in my purse, and nothing particular to interest me on shore.",
        "All happy families are alike; each unhappy family is unhappy in its own way.",
    ];

    const typingInput = document.getElementById('typing-input');
    const carOptions = document.querySelectorAll('.car-option');
    const targetTextElement = document.getElementById('target-text');
    const timerElement = document.getElementById('timer');
    const resultElement = document.getElementById('result');
    const restartButton = document.getElementById('restart-button');
    const resultContainer = document.querySelector('.result-container');
    const startButton = document.getElementById('start-button');
    const carSelection = document.getElementById('car-selection');
    const gameContainer = document.getElementById('game-container');
    const raceCar = document.getElementById('car1');

    let targetText = "";
    let currentWord = "";
    let remainingText = "";
    let typedWord = "";
    let timeLeft = targetText.length;
    let timerInterval;
    let carPosition = 0;
    let totalDistance = 900;

    const initializeGame = () => {
        targetText = paragraphs[Math.floor(Math.random() * paragraphs.length)];
        currentWord = targetText.split(" ")[0];
        remainingText = targetText.slice(currentWord.length + 1);
        updateDisplay();

        typingInput.value = "";
        typingInput.disabled = false;
        timeLeft = targetText.length;
        timerElement.textContent = `${timeLeft}s`;
        raceCar.style.left = "0px";
        carPosition = 0;

        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);

        resultElement.textContent = "";
        restartButton.style.display = "none";
        resultContainer.style.display = "none";

        typingInput.focus();
    };

    const updateDisplay = () => {
        const typedHTML = getTypedHTML(currentWord, typedWord);
        targetTextElement.innerHTML = `${typedHTML} <span class="remaining-text">${remainingText}</span>`;
    };

    const getTypedHTML = (word, typed) => {
        let html = "";
        for (let i = 0; i < word.length; i++) {
            if (i < typed.length) {
                const typedChar = typed[i];
                const wordChar = word[i];
                const charClass = typedChar === wordChar ? "correct-char" : "incorrect-char";
                html += `<span class="${charClass}">${wordChar}</span>`;
            } else {
                html += `<span>${word[i]}</span>`;
            }
        }
        return `<span class="current-word">${html}</span>`;
    };
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    const updateTimer = () => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = `${formatTime(timeLeft)}`;
        } else {
            clearInterval(timerInterval);
            typingInput.disabled = true;
            resultElement.textContent = "Time's up! You lost.";
            resultContainer.style.display = "block";
            restartButton.style.display = "block";
        }
    };

    typingInput.addEventListener("input", (e) => {
        typedWord = e.target.value;

        if (typedWord === currentWord + " ") {
            // Move to next word
            typedWord = "";
            typingInput.value = ""; // Clear input
            let typedText = targetText.length - remainingText.length;
            carPosition = (typedText / targetText.length) * totalDistance;
            raceCar.style.left = `${carPosition}px`;
            console.log(carPosition);
            currentWord = remainingText.split(" ")[0];
            remainingText = remainingText.slice(currentWord.length + 1).trim();
            if (!currentWord) {
                clearInterval(timerInterval);
                typingInput.disabled = true;
                resultElement.textContent = "Congratulations! You win!";
                resultContainer.style.display = "block";
                restartButton.style.display = "block";
            }
        }
        updateDisplay();
    });
    
    // Start Button Logic
    startButton.addEventListener('click', () => {
        if (selectedCar) {
            carSelection.style.display = "none";
            gameContainer.style.display = "block";
            initializeGame();
        } else {
           alert("Please select a car to start the game.");
        }
    });
      
    // Car Selection Logic
    carOptions.forEach(option => {
        option.addEventListener('click', () => {
            carOptions.forEach(car => car.classList.remove('selected'));
            option.classList.add('selected');
            selectedCar = option.dataset.car;
            raceCar.src = selectedCar;
        });
    });
    restartButton.addEventListener("click", initializeGame);
});

const changeDisplay = document.getElementById("change-display");
const displaySettings = document.getElementById("display-settings");
changeDisplay.addEventListener("click", () => {
    if(displaySettings.style.display === "block"){
        displaySettings.style.display = "none"
    }else{
        displaySettings.style.display = "block"
    }
});

const closeSettings = document.querySelector(".closeSettings");
closeSettings.addEventListener("click", () => {
    displaySettings.style.display = "none";
});

const changefontSize = document.getElementById("font-size");
const changefontFamily = document.getElementById("font-family");
changefontSize.addEventListener("change", (e) => {
    cfontSize(e.target.value);
})
changefontFamily.addEventListener("change", (e) => {
    cfontFamily(e.target.value);
})
function cfontFamily(fF) {
    
     console.log(fF);
    switch (fF) {
        case "Monospace":
            document.body.style.fontFamily = "monospace";
            break;
        case "Times New Roman":
            document.body.style.fontFamily = "Times New Roman";
            break;
        case "Arial":
            document.body.style.fontFamily = "Arial";
            break;
        case "Verdana":
            document.body.style.fontFamily = "Verdana";
            break;
        default:
            document.body.style.fontFamily = "monospace";
            break;
    }
}

function cfontSize(fS) {
    console.log(fS);
    switch (fS) {
        case "14px":
            document.body.style.fontSize = "14px";
            break;
        case "16px":
            document.body.style.fontSize = "16px";
            break;
        case "20px":
            document.body.style.fontSize = "20px";
            break;
        case "24px":
            document.body.style.fontSize = "24px";
            break;
        case "32px":
            document.body.style.fontSize = "32px";
            break;
        default:
            document.body.style.fontSize = "20px";
            break;
    }
}