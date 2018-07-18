import * as introductionKeyword from "../../src/assessments/seo/introductionKeywordAssessment";

const Paper = require( "../../js/values/Paper.js" );



const name = "englishPaper1";

const paper = new Paper( "This is a very interesting paper one two three.", { keyword: "one two three", locale: "en_EN" } );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "The focus keyword appears in the <a href='https://yoa.st/2pc' target='_blank'>first paragraph</a> of the copy.",
	},
	keyphraseLength: {
		score: 9,
		resultText: "Awesome keyphrase lenght",
	},
	keywordDensity: {
		score: 9,
		resultText: "Great keywordDensity!",
	},
	keywordStopWords: {
		score: 9,
		resultText: "AAAA",
	},




	fleschReadingEase: {
		score: 9,
		resultText: "The copy scores 66.1 in the <a href='https://yoa.st/flesch-reading' target='_blank'>Flesch Reading Ease</a> test, which is considered ok to read. ",
	}
};

module.exports = {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};
