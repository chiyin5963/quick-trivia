const username = document.getElementById("username");
const saveButton = document.getElementById("submit-button");
const endScoreText = document.getElementById("end-score");
const highScoreText = document.getElementById("high-score");
const endScore = localStorage.getItem("endScore");
let scores = localStorage.getItem("scores");
if (scores == "" || scores == null || scores == undefined) scores = [];
else scores = JSON.parse(scores);
//console.log(scores);
const MAX_SCORES = 10;

// Display score
endScoreText.innerText = endScore.toString();

// Get and display highscore
let highScore = 0;
if (scores.length > 0) {
	for (var i = 0; i < scores.length; ++i) {
		if (Number(scores[i].score) > highScore) highScore = Number(scores[i].score);
	}
}
highScoreText.innerText = "Current high score: " + highScore.toString();

username.addEventListener("keyup", function() {
	saveButton.disabled = !username.value;
});

const saveScore = function(event) {
	event.preventDefault();
	if (username.value.length === 0) {
		alert("Please enter a username.");
		return;
	}
	// Create score object and save to score array
	const scoreObject = {
		score: endScore,
		name: username.value
	};
	scores.push(scoreObject);
	scores.sort(function(a, b) {b.score - a.score;});
	scores.splice(MAX_SCORES); // Erase the 6th element if it exists
	// Save the new array of scores
	localStorage.setItem("scores", JSON.stringify(scores));

	window.location.assign("./index.html");
}