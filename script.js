document.addEventListener('DOMContentLoaded', () => {
    const paragraphs = [
        "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
        "Call me Ishmael. Some years ago - never mind how long precisely - having little or no money in my purse, and nothing particular to interest me on shore.",
        "All happy families are alike; each unhappy family is unhappy in its own way.",
      ]
    const typingInput = document.getElementById('typing-input');
    const carOptions = document.querySelectorAll('.car-option');
    const raceCar = document.getElementById('car1');
    const result = document.getElementById('result');
    const targetTextElement = document.getElementById('target-text');
    const timerElement = document.getElementById('timer');
    const statsElement = document.getElementById('stats');
    const startButton = document.getElementById('start-button');
    const carSelection = document.getElementById('car-selection');
    const restartButton = document.getElementById('restart-button');
    const greenCircle = document.querySelector('.circle.green');
    const yellowCircle = document.querySelector('.circle.yellow');
    const redCircle = document.querySelector('.circle.red');
    const gameContainer = document.getElementById('game-container');
    const container = document.querySelector('.container');
    const targetText = paragraphs[getRandomParagraph()];
    let remainingCharacters = document.querySelector('.remaining-characters');
    let wps = document.querySelector('#wps');
    let resultContainer = document.querySelector('.result-container');
    let carPosition = 0;
    let timeLeft = 0;
    let timeTaken = 0;
    let writtenChars = 0;
    let timerInterval;
    // let gameStartTime;
    let targetTextLength = targetText.length;
    let totalDistance;

    function  getRandomParagraph(){
        return Math.floor(Math.random() * paragraphs.length)
    }
    
    function updateTotalDistance() {
        const containerWidth = container.offsetWidth;
        const carWidth = raceCar.offsetWidth;
        totalDistance = containerWidth - carWidth; // Ensure the car stays within bounds
    }

    window.addEventListener('resize', updateTotalDistance); // Recalculate on window resize
    updateTotalDistance(); // Initial calculation


    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && typingInput.disabled) {
            if (selectedCar) {
                initializeGame();
            } else {
                result.textContent = "Please select a car to start!";
            }
        }
    });

    const initializeGame = () => {
        carPosition = 0;
        timeLeft = targetText.length;
        timeTaken = 0;
        writtenChars = 0;
        typingInput.value = "";
        typingInput.disabled = false;
        result.textContent = "";
        statsElement.textContent = "";
        restartButton.style.display = "none";
        resultContainer.style.display = "none";
        raceCar.style.left = "0px";
        timerElement.textContent = `${formatTime(timeLeft)} s`;
        greenCircle.classList.add('active');
        yellowCircle.classList.remove('active');
        redCircle.classList.remove('active');
        renderTargetText(0);
        clearInterval(timerInterval);
        gameStartTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
        remainingCharacters.textContent = targetTextLength;
        typingInput.focus();
    };

    const renderTargetText = (typedLength) => {
        targetTextElement.innerHTML = targetText.split("")
            .map((char, index) => {
                if (index < typedLength) {
                    return `<span class="matched">${char}</span>`;
                } else if (index === typedLength) {
                    return `<span class="unmatched cursor">${char}</span>`;
                } else {
                    return `<span class="unmatched">${char}</span>`;
                }
            }).join("");
    };
    renderTargetText(0);

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const updateTimer = () => {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.textContent = `${formatTime(timeLeft)} s`;
            updateCircles();
        } else {
            clearInterval(timerInterval);
            typingInput.disabled = true;
            resultContainer.style.display = "block";
            displayStats();
            result.textContent = "Time's up! You lost.";
            restartButton.style.display = "block";
            removeCursor();
        }
    };

    const updateCircles = () => {
        if (timeLeft > 30) {
            greenCircle.classList.add('active');
            yellowCircle.classList.remove('active');
            redCircle.classList.remove('active');
            redCircle.classList.remove('vibrate');
        } else if (timeLeft > 15) {
            greenCircle.classList.remove('active');
            yellowCircle.classList.add('active');
            redCircle.classList.remove('active');
        } else{
            greenCircle.classList.remove('active');
            yellowCircle.classList.remove('active');
            redCircle.classList.add('vibrate');
        }
    };

    const displayStats = () => {
        timeTaken = targetText.length - timeLeft;
        const speed = (writtenChars / timeTaken).toFixed(2);
        statsElement.innerHTML = `
            <p>Remaining Time: ${formatTime(timeLeft)} s</p>
            <p>Time Taken: ${formatTime(timeTaken)} s</p>
            <p>Writing Speed: ${speed} chars/s</p>
            <p>Written Characters: ${writtenChars}</p>
        `;
    };

    const removeCursor = () => {
        const cursor = targetTextElement.querySelector('.cursor');
        if (cursor) {
            cursor.classList.remove('cursor');
        }
    };

    typingInput.addEventListener('input', () => {
        const typedText = typingInput.value;
        writtenChars = typedText.length;

        let isCorrect = true;
        let firstErrorIndex = -1;

        const targetTextSpans = targetTextElement.querySelectorAll("span");
        for (let i = 0; i < targetText.length; i++) {
            const char = targetText[i];
            if (i < typedText.length) {
                if (typedText[i] === char) {
                    targetTextSpans[i].className = "matched";
                } else {
                    targetTextSpans[i].className = "error";
                    isCorrect = false;
                    if (firstErrorIndex === -1) {
                        firstErrorIndex = i;
                    }
                }
            } else {
                targetTextSpans[i].className = "unmatched";
            }
        }

        const cursor = targetTextElement.querySelector(".cursor");
        if (cursor) {
            cursor.classList.remove("cursor");
        }

        if (isCorrect) {
            if (typedText.length < targetText.length) {
                targetTextSpans[typedText.length].classList.add("cursor");
            }
            remainingCharacters.textContent = targetTextLength - typedText.length;
            carPosition = (typedText.length / targetText.length) * totalDistance;
            raceCar.style.left = `${carPosition}px`;
        } else if (firstErrorIndex !== -1) {
            targetTextSpans[firstErrorIndex].classList.add("cursor");
        }

        if (typedText === targetText) {
            clearInterval(timerInterval);
            typingInput.disabled = true;
            resultContainer.style.display = "block";
            displayStats();
            result.textContent = "Congratulations! You won!";
            restartButton.style.display = "block";
        }
    });

        carOptions.forEach(option => {
            option.addEventListener('click', () => {
                carOptions.forEach(car => car.classList.remove('selected'));
                option.classList.add('selected');
                startButton.style.display = "block";
                selectedCar = option.dataset.car;
                raceCar.src = selectedCar;
            });
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
const targetTextContainer = document.querySelector(".target-text-container");
changefontSize.addEventListener("change", (e) => {
    cfontSize(e.target.value);
})
changefontFamily.addEventListener("change", (e) => {
    cfontFamily(e.target.value);
})
function cfontFamily(fF) {
    switch (fF) {
        case "Monospace":
            targetTextContainer.style.fontFamily = "monospace";
            break;
        case "Times New Roman":
            targetTextContainer.style.fontFamily = "Times New Roman";
            break;
        case "Arial":
            targetTextContainer.style.fontFamily = "Arial";
            break;
        case "Verdana":
            targetTextContainer.style.fontFamily = "Verdana";
            break;
        default:
            targetTextContainer.style.fontFamily = "monospace";
            break;
    }
}

function cfontSize(fS) {
    switch (fS) {
        case "14px":
            targetTextContainer.style.fontSize = "14px";
            break;
        case "16px":
            targetTextContainer.style.fontSize = "16px";
            break;
        case "20px":
            targetTextContainer.style.fontSize = "20px";
            break;
        case "24px":
            targetTextContainer.style.fontSize = "24px";
            break;
        case "32px":
            targetTextContainer.style.fontSize = "32px";
            break;
        default:
            targetTextContainer.style.fontSize = "20px";
            break;
    }
}
