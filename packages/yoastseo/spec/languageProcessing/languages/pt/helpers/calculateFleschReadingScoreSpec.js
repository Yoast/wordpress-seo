import calculateScore from "../../../../../src/languageProcessing/languages/pt/helpers/calculateFleschReadingScore";

const statistics = {
	numberOfWords: 600,
	numberOfSyllables: 1200,
	averageWordsPerSentence: 19,
};

describe( "test for calculating the Portuguese Flesch reading ease score", function() {
	it( "returns the Flesch reading ease score for Portuguese", function() {
		expect( calculateScore( statistics ) ).toEqual(  60.4 );
	} );
} );
