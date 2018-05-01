module.exports = {
	sentenceLength: {
		recommendedWordCount: 20,
		slightlyTooMany: 25,
		farTooMany: 30,
	},
	fleschReading: {
		borders: {
			veryEasy: 90,
			easy: 80,
			fairlyEasy: 70,
			okay: 60,
			fairlyDifficult: 50,
			difficult: 30,
			veryDifficult: 0,
		},
		veryEasy: {
			score: 9,
			resultText: "very easy",
			note: "",
		},
		easy: {
			score: 9,
			resultText: "easy",
			note: "",
		},
		fairlyEasy: {
			score: 9,
			resultText: "fairly easy",
			note: "",
		},
		okay: {
			score: 9,
			resultText: "ok",
			note: "",
		},
		fairlyDifficult: {
			score: 6,
			resultText: "fairly difficult",
			note: "Try to make shorter sentences to improve readability.",
		},
		difficult: {
			score: 3,
			resultText: "difficult",
			note: "Try to make shorter sentences, using less difficult words to improve readability.",
		},
		veryDifficult: {
			score: 3,
			resultText: "very difficult",
			note: "Try to make shorter sentences, using less difficult words to improve readability.",
		},
	},
};
