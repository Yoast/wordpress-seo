var getSentences = require( "../../js/stringProcessing/getSentences.js" );
describe("Get sentences from text", function(){
	it("returns sentences", function () {
		var sentence = "Hello. How are you? Bye";
		expect( getSentences( sentence )[0] ).toBe( "Hello.");
		expect( getSentences( sentence )[1] ).toBe( "How are you?");
		expect( getSentences( sentence )[2] ).toBe( "Bye");
	});
	it("returns sentences with digits", function () {
		var sentence = "Hello. 123 Bye";
		expect( getSentences( sentence )[0] ).toBe( "Hello.");
		expect( getSentences( sentence )[1] ).toBe( "123 Bye");
	});

	it("returns sentences with abbreviations", function () {
		var sentence = "It was a lot. Approx. two hundred";
		expect( getSentences( sentence )[0] ).toBe( "It was a lot.");
		expect( getSentences( sentence )[1] ).toBe( "Approx. two hundred");
	});

	it("returns sentences with a ! in it (should not be converted to . )", function () {
		var sentence = "It was a lot. Approx! two hundred";
		expect( getSentences( sentence )[0] ).toBe( "It was a lot.");
		expect( getSentences( sentence )[1] ).toBe( "Approx! two hundred");
	});
	it("returns sentences with a text with H2 tags", function() {
		var text = "<h2>Four types of comments</h2>" +
			"The comments people leave on blogs can be divided into four types: " +
			"<h2>Positive feedback</h2>" +
			"First, the positive feedback. ";
		expect( getSentences( text ).length ).toBe( 4 );
		expect( getSentences( text )[ 0 ] ).toBe( "<h2>Four types of comments</h2>" );
		expect( getSentences( text )[ 1 ] ).toBe( "The comments people leave on blogs can be divided into four types:" );
		expect( getSentences( text )[ 2 ] ).toBe( "<h2>Positive feedback</h2>" );
		expect( getSentences( text )[ 3 ] ).toBe( "First, the positive feedback. " );
	})
});
