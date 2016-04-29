var subHeadingLength = require( "../../js/researches/getSubheadingLength.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "gets the length of subheadings", function() {
	it( "returns an array with lengths", function() {
		var mockPaper = new Paper( "<h2>test</h2><h2>two words</h2><h3>very long sentence</h3>" );
		expect( subHeadingLength( mockPaper ) ).toContain( 4 );
		expect( subHeadingLength( mockPaper ) ).toContain( 9 );
		expect( subHeadingLength( mockPaper ) ).toContain( 18 );
	} );
} );
