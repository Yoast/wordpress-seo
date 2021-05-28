import calculateScore from "../../../../../src/languageProcessing/languages/en/helpers/calculateFleschReadingScore";

const statistics = {
	numberOfWords: 400,
	numberOfSyllables: 800,
	averageWordsPerSentence: 20,
};

describe( "test for calculating the English Flesch reading ease score", function() {
	it( "returns the Flesch reading ease score for English", function() {
		expect( calculateScore( statistics ) ).toEqual(  17.3 );
	} );
} );
