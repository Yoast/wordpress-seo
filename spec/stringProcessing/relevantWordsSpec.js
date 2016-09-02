var WordCombination = require( "../../js/values/WordCombination" );
var relevantWords = require( "../../js/stringProcessing/relevantWords" );
var getRelevantWords = relevantWords.getRelevantWords;
var getWordCombinations = relevantWords.getWordCombinations;
var calculateOccurrences = relevantWords.calculateOccurrences;
var getRelevantCombinations = relevantWords.getRelevantCombinations;
var sortCombinations = relevantWords.sortCombinations;
var filterArticlesAtBeginning = relevantWords.filterArticlesAtBeginning;

describe( "getWordCombinations", function() {
	it( "should split a sentence on words", function() {
		var input = "A sentence";
		var expected = [ new WordCombination( [ "a" ] ), new WordCombination( [ "sentence" ] ) ];

		var actual = getWordCombinations( input, 1 );

		expect( actual ).toEqual( expected );
	});

	it( "splits a sentence on combinations", function() {
		var input = "This is a longer sentence";
		var expected = [
			new WordCombination( [ "this", "is" ] ),
			new WordCombination( [ "is", "a" ] ),
			new WordCombination( [ "a", "longer" ] ),
			new WordCombination( [ "longer", "sentence" ] )
		];

		var actual = getWordCombinations( input, 2 );

		expect( actual ).toEqual( expected );
	});

	it( "splits while taking into account different sentences", function() {
		var input = "This is a longer sentence. More sentence, more fun.";
		var expected = [
			new WordCombination( [ "this", "is" ] ),
			new WordCombination( [ "is", "a" ] ),
			new WordCombination( [ "a", "longer" ] ),
			new WordCombination( [ "longer", "sentence" ] ),
			new WordCombination( [ "more", "sentence" ] ),

			// Decided to also match over commas, because the impact should be neglectable.
			new WordCombination( [ "sentence", "more" ] ),
			new WordCombination( [ "more", "fun" ] )
		];

		var actual = getWordCombinations( input, 2 );

		expect( actual ).toEqual( expected );
	});
});

describe( "calculateOccurrences", function() {
	it( "calculates occurrences based on a list of word combinations", function() {
		var input = [
			new WordCombination( [ "irrelevant" ] ),
			new WordCombination( [ "occurrence" ] ),
			new WordCombination( [ "irrelevant" ] )
		];
		var expected = [
			new WordCombination( [ "irrelevant" ], 2 ),
			new WordCombination( [ "occurrence" ], 1 )
		];

		var actual = calculateOccurrences( input );

		expect( actual ).toEqual( expected );
	});
});

describe( "getRelevantCombinations", function() {
	it( "removes combinations with one occurence", function() {
		var input = [
			new WordCombination( [ "irrelevant" ], 1 ),
			new WordCombination( [ "occurrence" ], 2 )
		];
		var expected = [
			new WordCombination( [ "occurrence" ], 2 )
		];

		var actual = getRelevantCombinations( input, 100 );

		expect( actual ).toEqual( expected );
	});

	it( "removes function words", function() {
		var input = [
			new WordCombination( [ "yes" ], 2 )
		];
		var expected = [];

		var actual = getRelevantCombinations( input, 100 );

		expect( actual ).toEqual( expected );
	});

	it( "removes words with a high density", function() {
		var combination = new WordCombination( ["density"], 2 );
		var input = [ combination ];
		var density = 0;
		combination.getDensity = function() {
			return density;
		};

		expect( getRelevantCombinations( input, 0 ) ).toEqual( input );

		density = 0.03;
		expect( getRelevantCombinations( input, 0 ) ).toEqual( [] );

		density = 0.0299;
		expect( getRelevantCombinations( input, 0 ) ).toEqual( input );

		density = 0.01;
		expect( getRelevantCombinations( input, 0 ) ).toEqual( input );

		density = 0.09;
		expect( getRelevantCombinations( input, 0 ) ).toEqual( [] );
	})
});

describe( "sortCombinations", function() {
	it( "sorts based on relevance", function() {
		spyOn( WordCombination.prototype, "getRelevance" ).and.callFake( function() {
			return this._occurrences;
		});

		// var relevanceIsOccurrences = function() {
		// 	return this._occurrences;
		// };
		var combination1 = new WordCombination( [ "word1" ], 2 );
		var combination2 = new WordCombination( [ "word2" ], 3 );

		var output = [ combination1, combination2 ];
		var initial = [ combination1, combination2 ];
		var reversed = [ combination2, combination1 ];

		sortCombinations( output );

		expect( output ).toEqual( reversed );

		combination1.incrementOccurrences(); combination1.incrementOccurrences();
		sortCombinations( output );
		expect( output ).toEqual( initial );

		combination2.incrementOccurrences(); combination2.incrementOccurrences();
		sortCombinations( output );
		expect( output ).toEqual( reversed );
	});
});

describe( "filterArticlesAtBeginning", function() {
	it ( "filters word combinations beginning with articles", function() {
		var input = [
			new WordCombination ( [ "a", "book" ] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
			];
		var expected = [
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];

		var combinations  = filterArticlesAtBeginning( input );

		expect( combinations ).toEqual ( expected );
	})
} );

describe( "getWordCombinations", function() {
	it( "returns word combinations", function() {
		var input = "Here are a ton of words. Words are very important. I think the word combinations are even more important. Word combinations for the win!";
		var expected = [
			new WordCombination( [ "word", "combinations" ], 2 ),
			new WordCombination( [ "words" ], 2 ),
			new WordCombination( [ "important" ], 2 ),
			new WordCombination( [ "word" ], 2 ),
			new WordCombination( [ "combinations" ], 2 ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		var words = getRelevantWords( input );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		});

		expect( words ).toEqual( expected );
	});
});
