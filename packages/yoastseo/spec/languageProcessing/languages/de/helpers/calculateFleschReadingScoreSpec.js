import calculateFleschReadingScore from "../../../../../src/languageProcessing/languages/de/helpers/calculateFleschReadingScore.js";

const testStatistics = {
	numberOfSentences: 10,
	numberOfWords: 50,
	numberOfSyllables: 100,
	averageWordsPerSentence: 5,
	syllablesPer100Words: 200,
};

describe( "a test to calculate the Flesch reading score in German", function() {
	it( "returns a score", function() {
		expect( calculateFleschReadingScore( testStatistics ) ).toBe( 58 );
	} );
} );
