module.exports = {
	sentenceLength: {
		recommendedWordCount: 20,
		slightlyTooMany: 25,
		farTooMany: 30,
	},
	fleschReading: {
		scores: {
			bad: 3,
			fine: 6,
			good: 9,
		},
		borders: {
			veryEasy: 90,
			easy: 80,
			fairlyEasy: 70,
			okay: 60,
			fairlyDifficult: 50,
			difficult: 30,
		},
		resultTexts: {
			veryEasy: "very easy",
			easy: "easy",
			fairlyEasy: "fairly easy",
			okay: "ok",
			fairlyDifficult: "fairly difficult",
			difficult: "difficult",
			veryDifficult: "very difficult",
		},
		notes: {
			fairlyDifficult: "Try to make shorter sentences to improve readability.",
			difficult: "Try to make shorter sentences, using less difficult words to improve readability.",
		},
	},
};
