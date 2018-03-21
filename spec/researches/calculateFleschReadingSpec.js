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

describe( "A test that uses the German Flesch Reading", function() {
	it( "returns a score", function () {
		var mockPaper = new Paper( "Zero Hour ist eine nach kanadischer Idee in Großbritannien produzierte dokumentarische Fernsehreihe die auf dem History Channel in Kanada.", { locale: "de_DE" } );
		expect( fleschFunction( mockPaper ) ).toBe( 25.5 );
	} );

	it( "returns a score", function () {
		var mockPaper = new Paper( "Unterhalb der Szene, die aus plastischen Figuren besteht, erkennt man wieder Fruchtornament.", { locale: "de_DE" } );
		expect( fleschFunction( mockPaper ) ).toBe( 46.1 );
	} );
} );

describe( "A test that uses the Italian Flesch Reading", function() {
	it( "returns a score", function () {
		var mockPaper = new Paper( "Che bella cosa e 'una sola giornata, n'aria serena doppo na tempesta.", { locale: "it_IT" } );
		expect( fleschFunction( mockPaper ) ).toBe( 81.4 );
	} );
} );

describe( "A test that uses the Russian Flesch Reading", function() {
	it( "returns a score", function () {
		var mockPaper = new Paper( "Это бесконечно длинное предложение на русском языке, в нем чрезвычайно много довольно длинных слов, и понять его очень сложно.", { locale: "ru_RU" } );
		expect( fleschFunction( mockPaper ) ).toBe( 49.3 );
	} );
} );

describe( "A test that returns 0 after sentence formatting", function() {
	it( "returns a score of 0", function() {
		var mockPaper = new Paper( "()" );
		expect( fleschFunction( mockPaper ) ).toBe( 0 );
	} )
} );
