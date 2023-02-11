const usernamePlaces = [...Array.from(document.getElementsByClassName("table-username"))];
const scorePlaces =  [...Array.from(document.getElementsByClassName("table-score"))];
let scores = localStorage.getItem("scores");
if (scores === "") scores = [];
else scores = JSON.parse(scores);

// Sort scores
scores.sort(function(a, b) {return b.score - a.score});

// Display score entries
for (var i = 0; i < scores.length; ++i) {
	usernamePlaces[i].innerText = scores[i].name;
	scorePlaces[i].innerText = scores[i].score;
}