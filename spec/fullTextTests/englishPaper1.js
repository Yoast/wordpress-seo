import * as introductionKeyword from "../../src/assessments/seo/introductionKeywordAssessment";

const Paper = require( "../../js/values/Paper.js" );



const name = "englishPaper1";

const paper = new Paper( "This is a very interesting paper", { locale: "en_EN" } );

const expectedResults = {
	introductionKeyword: {
		score: 9,
		resultText: "You are awesome in introductionKeyword assessment!",
	},
	fleschReadingEase: {
		score: 9,
		resultText: "You are also awesome in Flesch reading ease!",
	}
};

module.exports = {
	name: name,
	paper: paper,
	expectedResults: expectedResults,
};
