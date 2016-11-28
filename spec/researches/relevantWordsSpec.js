var relevantWordsResearch = require( "../../js/researches/relevantWords" );
var Paper = require( "../../js/values/Paper" );
var WordCombination = require( "../../js/values/WordCombination" );
var functionWords = require( "../../js/researches/english/functionWords.js" )().all;

describe( "relevantWords research", function() {

	it( "calls through to the string processing function", function() {
		var input = "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are even more important. Syllable combinations for the win!";
		input = new Paper( input );
		var expected = [
			new WordCombination( [ "syllable", "combinations" ], 2, functionWords ),
			new WordCombination( [ "syllables" ], 2, functionWords ),
			new WordCombination( [ "important" ], 2, functionWords ),
			new WordCombination( [ "syllable" ], 2, functionWords ),
			new WordCombination( [ "combinations" ], 2, functionWords ),
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
