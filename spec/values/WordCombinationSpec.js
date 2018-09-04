import WordCombination from '../../src/values/WordCombination';
var functionWords = require( "../../src/researches/english/functionWords.js" )().all;

describe( "WordCombination", function() {
	describe( "getCombination", function() {
		it( "returns the combination as it occurs in the text", function() {
			var combination = new WordCombination( [ "the", "combination" ] );

			expect( combination.getCombination() ).toBe( "the combination" );
		} );
	} );

	describe( "getOccurrences", function() {
		it( "defaults to 0 occurrences", function() {
			var combination = new WordCombination( [] );

			expect( combination.getOccurrences() ).toBe( 0 );
		} );

		it( "can increment using an increment function", function() {
			var combination = new WordCombination( [] );

			combination.incrementOccurrences();
			combination.incrementOccurrences();
			combination.incrementOccurrences();

			expect( combination.getOccurrences() ).toBe( 3 );
		} );
	} );

	describe( "getLengthBonus", function() {
		it( "is based on the length", function() {
			let combination = new WordCombination( [ "word", "word2" ] );

			expect( combination.getLengthBonus() ).toBe( WordCombination.lengthBonus[ "2" ] );
		} );

		it( "defaults to 1 for undefined lengths", function() {
			var combination = new WordCombination( [ "word1", "2", "3", "4", "5", "6", "7" ] );
			expect( combination.getLengthBonus() ).toBe( 0 );

			combination = new WordCombination( [ "word" ] );
			expect( combination.getLengthBonus() ).toBe( 0 );
		} );
	} );

	describe( "getMultiplier", function() {
		it( "scales linearly between the base of 1 and the current relevance", function() {
			WordCombination.lengthBonus[ "2" ] = 1;

			var combination = new WordCombination( [ "word", "word2" ] );

			expect( combination.getMultiplier( 0.5 ) ).toBe( 1.5 );
			expect( combination.getMultiplier( 0.8 ) ).toBe( 1.8 );
			expect( combination.getMultiplier( 0.2 ) ).toBe( 1.2 );

			WordCombination.lengthBonus[ "2" ] = 100;

			expect( combination.getMultiplier( 0.5 ) ).toBe( 51 );
			expect( combination.getMultiplier( 0.8 ) ).toBe( 81 );
			expect( combination.getMultiplier( 0.2 ) ).toBe( 21 );
		} );
	} );

	describe( "isRelevantWord", function() {
		it( "determines if the word is relevant based on the word relevance", function() {
			var wordRelevance = {
				word1: 2,
			};

			var combination = new WordCombination( [] );
			combination.setRelevantWords( wordRelevance );

			expect( combination.isRelevantWord( "word1" ) ).toBe( true );
			expect( combination.isRelevantWord( "word2" ) ).toBe( false );
		} );
	} );

	describe( "getRelevantWordPercentage", function() {
		it( "sets the relevance to 1 for 1 word combinations", function() {
			var combination = new WordCombination( [ "word" ] );

			expect( combination.getRelevantWordPercentage() ).toBe( 1 );
		} );

		it( "determines the relevance for all the words in the combination", function() {
			var combination = new WordCombination( [ "word1", "word2" ] );
			combination.setRelevantWords( { word1: 2 } );

			expect( combination.getRelevantWordPercentage() ).toBe( 0.5 );

			combination = new WordCombination( [ "word1", "word2", "word3", "word4" ] );
			combination.setRelevantWords( { word1: 2 } );

			expect( combination.getRelevantWordPercentage() ).toBe( 0.25 );

			combination.setRelevantWords( { word1: 2, word2: 2 } );
			expect( combination.getRelevantWordPercentage() ).toBe( 0.5 );

			combination.setRelevantWords( { word1: 2, word2: 2, word3: 2, word4: 2 } );
			expect( combination.getRelevantWordPercentage() ).toBe( 1 );

			combination.setRelevantWords( {} );
			expect( combination.getRelevantWordPercentage() ).toBe( 0 );
		} );
	} );

	describe( "getRelevance", function() {
		it( "should mark function words as irrelevant", function() {
			var combination = new WordCombination( [ "yes" ], 2, functionWords );

			expect( combination.getRelevance() ).toBe( 0 );
		} );

		it( "should mark combination without relevant words as irrelevant", function() {
			var combination = new WordCombination( [ "word1", "word2" ] );

			expect( combination.getRelevance() ).toBe( 0 );
		} );

		it( "should multiple the length relevance with the amount of occurences", function() {
			var combination = new WordCombination( [ "word1", "word2" ] );
			combination.setRelevantWords( { word1: 2 } );
			var lengthRelevance = 1;

			combination.getMultiplier = function() {
				return lengthRelevance;
			};

			expect( combination.getRelevance() ).toBe( 0 );

			combination.incrementOccurrences();
			expect( combination.getRelevance() ).toBe( 1 );

			combination.incrementOccurrences();
			expect( combination.getRelevance() ).toBe( 2 );

			lengthRelevance = 2;
			expect( combination.getRelevance() ).toBe( 4 );

			combination.incrementOccurrences();
			expect( combination.getRelevance() ).toBe( 6 );
		} );
	} );

	describe( "getDensity", function() {
		it( "calculates density based on the occurences", function() {
			var combination = new WordCombination( [] );

			expect( combination.getDensity( 100 ) ).toBe( 0 );

			combination.incrementOccurrences();
			expect( combination.getDensity( 100 ) ).toBe( 0.01 );
			expect( combination.getDensity( 2 ) ).toBe( 0.5 );

			combination.incrementOccurrences();
			combination.incrementOccurrences();
			expect( combination.getDensity( 6 ) ).toBe( 0.5 );
		} );
	} );

	describe( "getWords", function() {
		it( "returns a list of words", function() {
			var combination = new WordCombination( [ "hello", "how", "are", "you" ] );
			expect( combination.getWords() ).toEqual( [ "hello", "how", "are", "you" ] );
		} );
	} );
} );
