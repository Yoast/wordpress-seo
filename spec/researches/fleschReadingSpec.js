var fleschFunction = require( "../../js/researches/calculateFleschReading.js" );
var Paper = require( "../../js/values/Paper.js" );

describe("a test to calculate the fleschReading score", function(){
	it("returns a score", function(){

		var mockPaper = new Paper( "A piece of text to calculate scores." );
		expect( fleschFunction( mockPaper ) ).toBe( 91 );

		mockPaper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" );
		expect( fleschFunction( mockPaper )).toBe( 63.9 );

		mockPaper = new Paper( "" );
		expect( fleschFunction( mockPaper ) ).toBe( 0 );
	});
});
describe( "A test to check the filtere of digits", function() {
	var mockPaper = new Paper( "A text string to test with digits");
	var mockPaperWithDigits = new Paper( "A 456 text string to test with 123 digits");
	it( "should return the same for a text string with only extra digits", function(){
		expect( fleschFunction( mockPaper ) ).toBe( fleschFunction( mockPaperWithDigits ) );
	});
});

describe( "A test that uses the Dutch Flesch Reading", function() {
	it( "returns a score", function() {
		var mockPaper = new Paper( "Een kort stukje tekst in het Nederlands om te testen.", { locale: "nl_NL" } );
		expect( fleschFunction( mockPaper ) ).toBe( 89.7 );
	} );

	it( "returns a score", function() {
		var mockPaper = new Paper( "Dit is wat meer tekst om te testen. Het bestaat uit meerdere zinnen waardoor we een andere score moeten krijgen.", { locale: "nl_NL" } );
		expect( fleschFunction( mockPaper ) ).toBe( 78.2 );
	} );
} );
