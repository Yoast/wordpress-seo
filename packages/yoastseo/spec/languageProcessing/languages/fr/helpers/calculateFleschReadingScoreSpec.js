import calculateScore from "../../../../../src/languageProcessing/languages/fr/helpers/calculateFleschReadingScore";

const statistics = {
	numberOfWords: 400,
	numberOfSyllables: 600,
	numberOfSentences: 20,
};

describe( "test for calculating the French Flesch reading ease score", function() {
	it( "returns the Flesch reading ease score for French", function() {
		expect( calculateScore( statistics ) ).toEqual(  76.3 );
	} );
} );
