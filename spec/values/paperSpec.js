var Paper = require( "../../js/values/Paper.js" );

describe( "Creating an Paper", function(){
	it( "returns and empty keyword and text when no args are given", function() {
		var mockPaper = new Paper();

		expect( mockPaper.getKeyword() ).toBe( "" );
		expect( mockPaper.getText() ).toBe( "" );
	} );

	it( "returns and a valid keyword and text when args are given", function() {
		var mockPaper = new Paper( "keyword", "text with keyword" );

		expect( mockPaper.getKeyword() ).toBe( "keyword" );
		expect( mockPaper.getText() ).toBe( "text with keyword" );
	} );

} );
