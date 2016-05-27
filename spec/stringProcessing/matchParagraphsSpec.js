var matchParagraphs = require( "../../js/stringProcessing/matchParagraphs.js");

describe( "Matches paragraphs in a text", function() {
	it ( "returns an array of paragraphs in <p>tags", function() {
		var text = "<p>This is a text in p-tags</p><p>This is more text in p-tags</p>";
		expect( matchParagraphs( text ) ).toContain( "This is a text in p-tags" );
	} );

	it ( "returns an array of paragraphs from double linebreaks", function() {
		var text =  "This is a text\n\nwith double linebreaks";
		expect( matchParagraphs( text ) ).toContain( "This is a text" );
		expect( matchParagraphs( text ) ).toContain( "with double linebreaks" );
	} );

	it( "returns the complete text if no paragraphs or linebreaks are found", function () {
		var text = "This is a text without any paragraphs";
		expect( matchParagraphs ( text ) ).toContain( "This is a text without any paragraphs" );
	} );
} );
