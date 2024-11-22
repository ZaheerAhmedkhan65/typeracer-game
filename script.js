const paragraphs = [
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness.",
  "Call me Ishmael. Some years ago - never mind how long precisely - having little or no money in my purse, and nothing particular to interest me on shore.",
  "All happy families are alike; each unhappy family is unhappy in its own way.",
]
function  getRandomParagraph(){
    return Math.floor(Math.random() * paragraphs.length)
}

document.addEventListener('DOMContentLoaded', () => {
    const typingInput = document.getElementById('typing-input');
    const carOptions = document.querySelectorAll('.car-option');
    const raceCar = document.getElementById('car1');
    const result = document.getElementById('result');
    const targetTextElement = document.getElementById('target-text');
    const timerElement = document.getElementById('timer');
    const statsElement = document.getElementById('stats');
    const restartButton = document.getElementById('restart-button');
    const greenCircle = document.querySelector('.circle.green');
    const yellowCircle = document.querySelector('.circle.yellow');
    const redCircle = document.querySelector('.circle.red');
    const totalDistance = 970;
    const targetText = paragraphs[getRandomParagraph()];
    let remainingCharacters = document.querySelector('.remaining-characters');
    let wps = document.querySelector('#wps');
    let resultContainer = document.querySelector('.result-container');
    console.log(totalDistance)
    let carPosition = 0;
    let timeLeft = 60;
    let timeTaken = 0;
    let writtenChars = 0;
    let timerInterval;
    let gameStartTime;
    let targetTextLength = targetText.length;
    
    // Set up car customization
    let selectedCar = 'car1.png';

    // Car selection logic
    carOptions.forEach(option => {
        option.addEventListener('click', () => {
            carOptions.forEach(car => car.classList.remove('selected')); // Remove previous selection
            option.classList.add('selected'); // Highlight selected car
            selectedCar = option.dataset.car; // Update selected car
            raceCar.src = selectedCar; // Update race car image
            result.textContent = "Car selected! Ready to start.";
        });
    });
    
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
        timerElement.textContent = `${timeLeft} s`;
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
            <p>Remaining Time: ${timeLeft} s</p>
            <p>Time Taken: ${timeTaken}s</p>
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
            console.log("Car Position : " + carPosition)
        } else if (firstErrorIndex !== -1) {
            targetTextSpans[firstErrorIndex].classList.add("cursor");
        }

        if (typedText === targetText) {
            clearInterval(timerInterval);
            typingInput.disabled = true;
            resultContainer.style.display = "block";
            displayStats();
            result.textContent = "Congratulations! You win!";
            restartButton.style.display = "block";
        }
    });

    restartButton.addEventListener('click', initializeGame);

    initializeGame();
});

