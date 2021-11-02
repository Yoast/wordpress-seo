import wordComplexity from "../../../src/languageProcessing/researches/wordComplexity.js";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";

describe( "A function for getting the complexity level per word",  function() {
	it( "returns an array with the complexity level per word", function() {
		let mockPaper = new Paper( "word" );

		expect( wordComplexity( mockPaper, new Researcher( mockPaper ) )[ 0 ].words[ 0 ].complexity ).toBe( 1 );

		mockPaper = new Paper( "double" );
		expect( wordComplexity( mockPaper, new Researcher( mockPaper ) )[ 0 ].words[ 0 ].complexity ).toBe( 2 );

		mockPaper = new Paper( "strawberry cake" );
		expect( wordComplexity( mockPaper, new Researcher( mockPaper ) )[ 0 ].words[ 0 ].complexity ).toBe( 3 );
		expect( wordComplexity( mockPaper, new Researcher( mockPaper ) )[ 0 ].words[ 1 ].complexity ).toBe( 1 );
	} );
} );
