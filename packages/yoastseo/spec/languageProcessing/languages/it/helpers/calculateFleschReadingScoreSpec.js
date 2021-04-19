import calculateScore from "../../../../../src/languageProcessing/languages/it/helpers/calculateFleschReadingScore";

const statistics = {
	averageWordsPerSentence: 19,
	syllablesPer100Words: 250,
};

describe( "test for calculating the Italian Flesch reading ease score", function() {
	it( "returns the Flesch reading ease score for Italian", function() {
		expect( calculateScore( statistics ) ).toEqual(  42.3 );
	} );
} );
