let WordCombination = require( "../../js/values/WordCombination" );
let relevantWords = require( "../../js/stringProcessing/relevantWords" );
let getWordCombinations = relevantWords.getWordCombinations;
let getRelevantWords = relevantWords.getRelevantWords;
let calculateOccurrences = relevantWords.calculateOccurrences;
let getRelevantCombinations = relevantWords.getRelevantCombinations;
let sortCombinations = relevantWords.sortCombinations;
let filterFunctionWordsAtBeginning = relevantWords.filterFunctionWordsAtBeginning;
let filterFunctionWords = relevantWords.filterFunctionWords;
let filterSpecialCharacters = relevantWords.filterSpecialCharacters;
let filterOnSyllableCount = relevantWords.filterOnSyllableCount;
let filterOnDensity = relevantWords.filterOnDensity;
let englishFunctionWords = require( "../../js/researches/english/functionWords.js" )().all;

describe( "getWordCombinations", function() {
	it( "splits a sentence on words", function() {
		let input = "A sentence";
		let expected = [ new WordCombination( [ "a" ] ), new WordCombination( [ "sentence" ] ) ];

		let actual = getWordCombinations( input, 1 );

		expect( actual ).toEqual( expected );
	});

	it( "splits a sentence on combinations", function() {
		let input = "This is a longer sentence";
		let expected = [
			new WordCombination( [ "this", "is" ] ),
			new WordCombination( [ "is", "a" ] ),
			new WordCombination( [ "a", "longer" ] ),
			new WordCombination( [ "longer", "sentence" ] )
		];

		let actual = getWordCombinations( input, 2 );

		expect( actual ).toEqual( expected );
	});

	it( "splits while taking into account different sentences", function() {
		let input = "This is a longer sentence. More sentence, more fun.";
		let expected = [
			new WordCombination( [ "this", "is" ] ),
			new WordCombination( [ "is", "a" ] ),
			new WordCombination( [ "a", "longer" ] ),
			new WordCombination( [ "longer", "sentence" ] ),
			new WordCombination( [ "more", "sentence" ] ),

			// Decided to also match over commas, because the impact should be neglectable.
			new WordCombination( [ "sentence", "more" ] ),
			new WordCombination( [ "more", "fun" ] )
		];

		let actual = getWordCombinations( input, 2 );

		expect( actual ).toEqual( expected );
	});
});

describe( "calculateOccurrences", function() {
	it( "calculates occurrences based on a list of word combinations", function() {
		let input = [
			new WordCombination( [ "irrelevant" ] ),
			new WordCombination( [ "occurrence" ] ),
			new WordCombination( [ "irrelevant" ] )
		];
		let expected = [
			new WordCombination( [ "irrelevant" ], 2 ),
			new WordCombination( [ "occurrence" ], 1 )
		];

		let actual = calculateOccurrences( input );

		expect( actual ).toEqual( expected );
	});
});

describe( "getRelevantCombinations", function() {
	it( "removes combinations with one occurence", function() {
		let input = [
			new WordCombination( [ "irrelevant" ], 1, englishFunctionWords ),
			new WordCombination( [ "occurrence" ], 2, englishFunctionWords )
		];
		let expected = [
			new WordCombination( [ "occurrence" ], 2, englishFunctionWords )
		];

		let actual = getRelevantCombinations( input, 100 );

		expect( actual ).toEqual( expected );
	});

	it( "removes function words", function() {
		let input = [
			new WordCombination( [ "yes" ], 2, englishFunctionWords )
		];
		let expected = [];

		let actual = getRelevantCombinations( input, 100 );

		expect( actual ).toEqual( expected );
	});

	it( "removes words with a high density", function() {
		let combination = new WordCombination( ["density"], 2 );
		let input = [ combination ];
		let density = 0;
		combination.getDensity = function() {
			return density;
		};

		expect( filterOnDensity( input, 200, 0, 0.03 ) ).toEqual( input );

		density = 0.03;
		expect( filterOnDensity( input, 400, 0, 0.03 ) ).toEqual( [] );

		density = 0.0299;
		expect( filterOnDensity( input, 300, 0, 0.03 ) ).toEqual( input );

		density = 0.01;
		expect( filterOnDensity( input, 400, 0, 0.03 ) ).toEqual( input );

		density = 0.09;
		expect( filterOnDensity( input, 200, 0, 0.03 ) ).toEqual( [] );
	});

});

describe( "sortCombinations", function() {
	it( "sorts based on relevance", function() {
		spyOn( WordCombination.prototype, "getRelevance" ).and.callFake( function() {
			return this._occurrences;
		});

		// var relevanceIsOccurrences = function() {
		// 	return this._occurrences;
		// };
		let combination1 = new WordCombination( [ "word1" ], 2 );
		let combination2 = new WordCombination( [ "word2" ], 3 );

		let output = [ combination1, combination2 ];
		let initial = [ combination1, combination2 ];
		let reversed = [ combination2, combination1 ];

		sortCombinations( output );

		expect( output ).toEqual( reversed );

		combination1.incrementOccurrences(); combination1.incrementOccurrences();
		sortCombinations( output );
		expect( output ).toEqual( initial );

		combination2.incrementOccurrences(); combination2.incrementOccurrences();
		sortCombinations( output );
		expect( output ).toEqual( reversed );
	});
	it( "sorts based on length if the relevance is tied", function() {
		spyOn( WordCombination.prototype, "getRelevance" ).and.callFake( function() {
			return this._occurrences;
		});

		let combination1 = new WordCombination( [ "word1", "word3" ], 2 );
		let combination2 = new WordCombination( [ "word2" ], 2 );
		let combination3 = new WordCombination( [ "word4" ], 3 );

		let output = [ combination1, combination2, combination3 ];
		let sorted = [ combination3, combination1, combination2 ];

		sortCombinations( output );

		expect( output ).toEqual( sorted );
	});
});

describe( "filter articles at beginning", function() {
	it ( "filters word combinations beginning with an article", function() {
		let input = [
			new WordCombination ( [ "a", "book" ] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];
		let expected = [
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];

		let combinations  = filterFunctionWordsAtBeginning( input, [ "the", "an", "a" ] );

		expect( combinations ).toEqual( expected );
	} );
	it ( "does not filter word combinations ending with an article", function() {
		let input = [
			new WordCombination ( [ "book", "a" ] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];
		let expected = [
			new WordCombination ( [ "book", "a" ] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];

		let combinations  = filterFunctionWordsAtBeginning( input, [ "the", "an", "a" ] );

		expect( combinations ).toEqual( expected );
	} );
} );

describe( "filter articles at beginning and end", function() {
	it ( "filters word combinations beginning and ending with an article", function() {
		let input = [
			new WordCombination ( [ "a", "book" ] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "a"] )
		];
		let expected = [
			new WordCombination ( [ "book" ] ),
		];

		let combinations  = filterFunctionWords( input, [ "the", "an", "a" ] );

		expect( combinations ).toEqual( expected );
	} );
} );

describe( "filter articles at end", function() {
	it ( "filters word combinations ending with an article", function() {
		let input = [
			new WordCombination ( [ "book", "a" ] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];
		let expected = [
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];

		let combinations  = filterFunctionWords( input, [ "the", "an", "a" ] );

		expect( combinations ).toEqual( expected );
	});
} );

describe( "filter special characters in word combinations", function() {
	it ( "filters word combinations containing special characters", function() {
		let input = [
			new WordCombination ( [ "book", "a", "-" ] ),
			new WordCombination ( [ "—", "book" ] ),
			new WordCombination ( [ "book", "–", "club"] ),
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];
		let expected = [
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "book", "club"] )
		];

		let combinations  = filterSpecialCharacters( input, [ "–", "—", "-" ] );

		expect( combinations ).toEqual( expected );
	});
} );

describe( "filter single words based on syllable count", function() {
	it ( "filters one-syllable single words", function() {
		let input = [
			new WordCombination ( [ "book" ] ),
			new WordCombination ( [ "a", "book" ] ),
			new WordCombination ( [ "book", "club"] ),
		];
		let expected = [
			new WordCombination ( [ "a", "book" ] ),
			new WordCombination ( [ "book", "club"] ),
		];

		let combinations  = filterOnSyllableCount( input, 1 );

		expect( combinations ).toEqual( expected );
	});
} );

describe( "getRelevantWords", function() {
	it( "uses the default (English) function words in case of a unknown locale", function() {
		let input = "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are even more important. Syllable combinations for the win! " +
			"This text needs to contain 200 words, because one filter will only work if a text is long enough. 200 words is really, really long. I will just start talking" +
			"about the weather. The weather is nice today, don't you think? It is sunny outside. It has been a while since it has rained. Let me think of something else to" +
			"talk about. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore" +
			" veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur" +
			" magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non" +
			" numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis" +
			" suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur," +
			" vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";
		let expected = [
			new WordCombination( [ "qui", "dolorem" ], 2, englishFunctionWords ),
			new WordCombination( [ "sed", "quia" ], 2, englishFunctionWords ),
			new WordCombination( [ "200", "words" ], 2, englishFunctionWords ),
			new WordCombination( [ "syllable", "combinations" ], 2, englishFunctionWords ),
			new WordCombination( [ "voluptatem" ], 4, englishFunctionWords ),
			new WordCombination( [ "quia" ], 4, englishFunctionWords ),
			new WordCombination( [ "syllables" ], 2, englishFunctionWords ),
			new WordCombination( [ "enim" ], 2, englishFunctionWords ),
			new WordCombination( [ "combinations" ], 2, englishFunctionWords ),
			new WordCombination( [ "dolorem" ], 2, englishFunctionWords ),
			new WordCombination( [ "velit" ], 2, englishFunctionWords ),
			new WordCombination( [ "consequatur" ], 2, englishFunctionWords ),
			new WordCombination( [ "syllable" ], 2, englishFunctionWords ),
			new WordCombination( [ "important" ], 2, englishFunctionWords ),
			new WordCombination( [ "weather" ], 2, englishFunctionWords ),
			new WordCombination( [ "voluptas" ], 2, englishFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "la_LA" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		});

		expect( words ).toEqual( expected );
	} );
} );
