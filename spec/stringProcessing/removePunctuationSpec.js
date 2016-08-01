var removePunctuation = require( "../../js/stringProcessing/removePunctuation.js" );

describe("a test removing punctuation from a string", function(){

	it("returns string without dash at the end", function(){
		expect( removePunctuation("test-") ).toBe( "test" );
	});

	it("returns string without dash at the beginning", function(){
		expect( removePunctuation("-test") ).toBe( "test" );
	});

	it("returns string with punctuation in middle of word untouched", function(){
		expect( removePunctuation("te-st") ).toBe( "te-st" );
	});

	it("returns string without punction around the word", function(){
		expect( removePunctuation("'test'") ).toBe( "test" );
	});

	it("returns string without () around the word", function(){
		expect( removePunctuation("test)") ).toBe( "test" );
	});

});

describe( "Removing punctuation at the begin and end of a word", function(){
	it( "returns a word without a terminator.", function() {
		expect( removePunctuation( "word." ) ).toBe( "word" );
		expect( removePunctuation( "10.000" ) ).toBe( "10.000" );
		expect( removePunctuation( "¿que?" ) ).toBe( "que" );
		expect( removePunctuation( "word!!" ) ).toBe( "word" );
		expect( removePunctuation( "¡¡word" ) ).toBe( "word" );
		expect( removePunctuation( "'word'" ) ).toBe( "word" );
		expect( removePunctuation( "'word'!!!???!!!!" ) ).toBe( "word" );
		expect( removePunctuation( "'word–" ) ).toBe( "word" );

	} );
} );
