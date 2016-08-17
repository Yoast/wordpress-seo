var relevantWordsResearch = require( "../../js/researches/relevantWords" );
var Paper = require( "../../js/values/Paper" );
var WordCombination = require( "../../js/values/WordCombination" );

describe( "relevantWords research", function() {

	it( "calls through to the string processing function", function() {
		var input = "Here are a ton of words. Words are very important. I think the word combinations are even more important. Word combinations for the win!";
		var input = new Paper( input );
		var expected = [
			new WordCombination( [ "word", "combinations" ], 2 ),
			new WordCombination( [ "words" ], 2 ),
			new WordCombination( [ "important" ], 2 ),
			new WordCombination( [ "word" ], 2 ),
			new WordCombination( [ "combinations" ], 2 ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		var words = relevantWordsResearch( input );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		});

		expect( words ).toEqual( expected );
	});
});
