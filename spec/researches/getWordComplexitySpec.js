var wordComplexity = require( "../../js/researches/getWordComplexity.js" );
var Paper = require( "../../js/values/Paper" );

describe( "A function for getting the syllables per word",  function(){
	it( "returns an array with the number of syllables per word", function(){
		var mockPaper = new Paper( "word" );
		expect( wordComplexity( mockPaper ) ).toContain( 1 );

		mockPaper = new Paper( "double" );
		expect( wordComplexity( mockPaper ) ).toContain( 2 );

		mockPaper = new Paper( "strawberry cake" );
		expect( wordComplexity( mockPaper ) ).toContain( 3 );
		expect( wordComplexity( mockPaper ) ).toContain( 1 );
	} );
} );
