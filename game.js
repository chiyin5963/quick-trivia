const game = document.getElementById("game");
const loader = document.getElementById("loader");
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const scoreText = document.getElementById("score-point");
const questionText = document.getElementById("question-hud-text");
const progressBarFill = document.getElementById("progress-bar-fill");

const MAX_QUESTIONS = 10;

let currentQuestion = {};     // Object to contain information for a question
let acceptingAnswers = true;  // Boolean to determine if an answer can be selected by the user
let score = 0;                // User score
let counter = 0;              // Question counter
let availableQuestions = [];  // Array of questions that can be used (subset of questions array below)

// Fetch questions
let questions = [];
fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple")
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		questions = data.results;
		startGame();
	})
	.catch(function(error) {
		console.log(error);
	});


let startGame = function() {
	counter = 0;
	score = 0;
	localStorage.setItem("endScore", score);
	availableQuestions = [...questions]; // Randomize contents of questions array
	getNewQuestion();
	game.classList.remove("hidden");
	loader.classList.add("hidden");
}

let getNewQuestion = function() {
	if (availableQuestions.length === 0 || counter >= MAX_QUESTIONS) {
		localStorage.setItem("endScore", score);
		return window.location.assign("./end.html");
	}
	counter++;

	// Update question text
	let questionsIndex = Math.floor(Math.random() * availableQuestions.length);
	currentQuestion = availableQuestions[questionsIndex];
	question.innerText = currentQuestion.question;
	question.innerText = question.innerText.replace(/&quot;/g, '"');
	question.innerText = question.innerText.replace(/&#039;/g, "'");
	// Fetch answers
	let answers = Array.from(currentQuestion.incorrect_answers);
	answers.push(currentQuestion.correct_answer);
	shuffle(answers);
	// Re-format answers to properly display quotations
	answers.forEach(function(answer) {
		answer = answer.replace(/&quot;/g, '"');
		answer = answer.replace(/&#039;/g, "'");
	});
	// Update choice text
	let n = 0;
	choices.forEach(function(choice) {
		choice.innerText = answers[n];
		n++;
	});
	// Update question count and progress bar
	questionText.innerText = "Question " + counter.toString() + " / " + MAX_QUESTIONS.toString();
	progressBarFill.style.width = "${(counter / MAX_QUESTIONS) * 100}%";
	progressBarFill.style.width = ((counter / MAX_QUESTIONS) * 100).toString() + "%";
	availableQuestions.splice(questionsIndex, 1);
	acceptingAnswers = true;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

choices.forEach(function(choice) {
    choice.addEventListener('click', function(e) {
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.innerText;
   		
        // Evaluate answer
        let answerClass = (selectedAnswer === currentQuestion.correct_answer) ? "correct" : "incorrect";
        // Update score
        score = (answerClass === "correct") ? score + 1 : score;
        selectedChoice.parentElement.classList.add(answerClass);
		scoreText.innerText = "  " + score;

		// Delay by 1000ms before fetching new question
        setTimeout(function() {
        	selectedChoice.parentElement.classList.remove(answerClass);
        	getNewQuestion();
        }, 1000);
    });
});