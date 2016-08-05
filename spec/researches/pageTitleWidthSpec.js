var pageTitleLength = require( "../../js/researches/pageTitleWidth.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "the page title width research", function() {
	it( "should return the pixels in the title", function() {
		expect( pageTitleLength( new Paper( "", { title: "title", titleWidth: 10 } ) ) ).toBe( 10 );
		expect( pageTitleLength( new Paper( "", { title: "" } ) ) ).toBe( 0 );
		expect( pageTitleLength( new Paper( "" ) ) ).toBe( 0 );
	})
});

