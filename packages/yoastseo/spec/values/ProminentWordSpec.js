import ProminentWord from "../../src/values/ProminentWord";

describe( "ProminentWord", function() {
	describe( "getWord", function() {
		it( "returns the word of the wordCombination", function() {
			const prominentWord = new ProminentWord( "tests", "test", 3 );
			expect( prominentWord.getWord() ).toBe( "tests" );
		} );
	} );

	describe( "setWord", function() {
		it( "set the word to the wordCombination", function() {
			const prominentWord = new ProminentWord( "tests", "test", 3 );
			prominentWord.setWord( "test" );
			expect( prominentWord.getWord() ).toBe( "test" );
		} );
	} );

	describe( "getStem", function() {
		it( "returns the stem of the wordCombination", function() {
			const prominentWord = new ProminentWord( "tests", "test", 3 );
			expect( prominentWord.getStem() ).toBe( "test" );
		} );

		it( "defaults to the word of the wordCombination", function() {
			const prominentWord = new ProminentWord( "tests" );
			expect( prominentWord.getStem() ).toBe( "tests" );
		} );
	} );

	describe( "getOccurrences", function() {
		it( "returns the number of occurrences", function() {
			const prominentWord = new ProminentWord( "test", "test", 5 );
			expect( prominentWord.getOccurrences() ).toBe( 5 );
		} );

		it( "defaults to 0 occurrences", function() {
			const prominentWord = new ProminentWord( "test", "test" );
			expect( prominentWord.getOccurrences() ).toBe( 0 );
		} );
	} );

	describe( "setOccurrences", function() {
		it( "sets the number of occurrences to the wordCombination", function() {
			const prominentWord = new ProminentWord( "tests", "test" );
			expect( prominentWord.getOccurrences() ).toBe( 0 );

			prominentWord.setOccurrences( 5 );
			expect( prominentWord.getOccurrences() ).toBe( 5 );
		} );
	} );
} );
