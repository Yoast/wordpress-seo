import calculateFleschReadingScore from "../../../../../src/languageProcessing/languages/de/helpers/calculateFleschReadingScore.js";

const statistics = {
	numberOfSentences: 10,
	numberOfWords: 100,
	numberOfSyllables: 350,
	averageWordsPerSentence: 10,
	syllablesPer100Words: 350,
};

describe( "a test to calculate the Flesch reading score in German", function() {
	it( "returns a score", function() {
		expect( calculateFleschReadingScore( statistics ) ).toBe( -34.7 );
	} );
} );
