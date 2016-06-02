var removePunctuation = require( "../../js/stringProcessing/removePunctuation.js" );

describe("a test removing punctuation from a string", function(){

	it("returns string without dash at the end", function(){
		expect( removePunctuation("test-") ).toBe( "test" );
	});

	it("returns string without dash at the beginning", function(){
		expect( removePunctuation("-test") ).toBe( "test" );
	});

	it("returns string without full stops", function(){
		expect( removePunctuation(".t.e.s.t") ).toBe( "test" );
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
