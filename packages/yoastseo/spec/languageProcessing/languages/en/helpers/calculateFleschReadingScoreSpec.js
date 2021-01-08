import calculateScore from "../../../../../src/languageProcessing/languages/en/helpers/calculateFleschReadingScore";

const statistics = {
	numberOfWords: 400,
	numberOfSyllables: 800,
	averageWordsPerSentence: 20,
};

describe( "findShortestAndAlphabeticallyFirst", function() {
	it( "returns the shortest and the alphabetically-first word from an array", function() {
		expect( calculateScore( statistics ) ).toEqual(  17.3 );
	} );
} );
