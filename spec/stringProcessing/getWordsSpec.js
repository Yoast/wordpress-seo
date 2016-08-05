var getWords = require( "../../js/stringProcessing/getWords" );

describe( "a test getting words from a sentence", function() {

	it( "returns an empty array", function() {
		expect( getWords( "" ).length ).toBe( 0 );
	});

	it( "returns an array without html", function() {
		var words = getWords( "<strong>strong</strong> and <em>emphasized</em>" );

		expect( words[0] ).toBe( "strong" );
		expect( words[1] ).toBe( "and" );
		expect( words[2] ).toBe( "emphasized" );
	});

	it( "returns an array without the space comma", function() {
		var words = getWords( "strong , emphasized" );

		expect( words[0] ).toBe( "strong" );
		expect( words[1] ).toBe( "emphasized" );
	});

	it( "returns the correct array of words with a ton of punctuation", function() {
		var words = getWords( "A sentence with words. And some; punctuation." );

		expect( words ).toEqual([
			"A",
			"sentence",
			"with",
			"words",
			"And",
			"some",
			"punctuation"
		]);
	});
});
