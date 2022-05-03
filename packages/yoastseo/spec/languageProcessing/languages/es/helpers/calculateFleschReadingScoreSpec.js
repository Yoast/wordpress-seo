import calculateScore from "../../../../../src/languageProcessing/languages/es/helpers/calculateFleschReadingScore";

const statistics = {
	numberOfWords: 1000,
	numberOfSentences: 100,
	syllablesPer100Words: 250,
};

describe( "test for calculating the Spanish Flesch reading ease score", function() {
	it( "returns the Flesch reading ease score for Spanish", function() {
		expect( calculateScore( statistics ) ).toEqual(  46.6 );
	} );
} );
