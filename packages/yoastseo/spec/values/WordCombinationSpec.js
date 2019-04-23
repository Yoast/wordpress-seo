import WordCombination from "../../src/values/WordCombination";

describe( "WordCombination", function() {
	describe( "getWord", function() {
		it( "returns the word of the wordCombination", function() {
			const combination = new WordCombination( "tests", "test", 3 );
			expect( combination.getWord() ).toBe( "tests" );
		} );
	} );

	describe( "setWord", function() {
		it( "set the word to the wordCombination", function() {
			const combination = new WordCombination( "tests", "test", 3 );
			combination.setWord( "test" );
			expect( combination.getWord() ).toBe( "test" );
		} );
	} );

	describe( "getStem", function() {
		it( "returns the stem of the wordCombination", function() {
			const combination = new WordCombination( "tests", "test", 3 );
			expect( combination.getStem() ).toBe( "test" );
		} );

		it( "defaults to the word of the wordCombination", function() {
			const combination = new WordCombination( "tests" );
			expect( combination.getStem() ).toBe( "tests" );
		} );
	} );

	describe( "getOccurrences", function() {
		it( "returns the number of occurrences", function() {
			const combination = new WordCombination( "test", "test", 5 );
			expect( combination.getOccurrences() ).toBe( 5 );
		} );

		it( "defaults to 0 occurrences", function() {
			const combination = new WordCombination( "test", "test" );
			expect( combination.getOccurrences() ).toBe( 0 );
		} );
	} );

	describe( "setOccurrences", function() {
		it( "sets the number of occurrences to the wordCombination", function() {
			const combination = new WordCombination( "tests", "test" );
			expect( combination.getOccurrences() ).toBe( 0 );

			combination.setOccurrences( 5 );
			expect( combination.getOccurrences() ).toBe( 5 );
		} );
	} );
} );
