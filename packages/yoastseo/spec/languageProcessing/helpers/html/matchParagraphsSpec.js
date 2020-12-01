import matchParagraphs from "../../../../src/languageProcessing/helpers/html/matchParagraphs.js";

describe( "Matches paragraphs in a text", function() {
	it( "returns an array of paragraphs in <p>tags", function() {
		const text = "<p>This is a text in p-tags</p><p>This is more text in p-tags</p>";
		expect( matchParagraphs( text ) ).toContain( "This is a text in p-tags" );
	} );

	it( "returns an array of paragraphs from double linebreaks", function() {
		const text =  "This is a text\n\nwith double linebreaks";
		expect( matchParagraphs( text ) ).toContain( "This is a text" );
		expect( matchParagraphs( text ) ).toContain( "with double linebreaks" );
	} );

	it( "returns the complete text if no paragraphs or linebreaks are found", function() {
		const text = "This is a text without any paragraphs";
		expect( matchParagraphs( text ) ).toContain( "This is a text without any paragraphs" );
	} );

	it( "returns empty string if there is no text", function() {
		const text = "";
		expect( matchParagraphs( text ) ).toContain( "" );
	} );

	it( "splits on headings", function() {
		const text = "A piece of text<h2>More piece of text</h2>Another piece of text.";
		const expected = [ "A piece of text", "Another piece of text." ];

		const actual = matchParagraphs( text );

		expect( actual ).toEqual( expected );
	} );

	it( "should see <div> tags as paragraphs", function() {
		const text = "A piece of text<div>More piece of text</div>Another piece of text.";
		const expected = [ "A piece of text", "<div>More piece of text</div>", "Another piece of text." ];

		const actual = matchParagraphs( text );

		expect( actual ).toEqual( expected );
	} );
} );
