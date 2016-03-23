var pageTitleLength = require( "../../js/researches/pageTitleLength.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "the page title length research", function() {
	it( "should count the words in the title", function() {
		expect( pageTitleLength( new Paper( "", { title: "Page Title" } ) ) ).toBe( 10 );
		expect( pageTitleLength( new Paper( "", { title: "" } ) ) ).toBe( 0 );
		expect( pageTitleLength( new Paper( "" ) ) ).toBe( 0 );
	})
});
