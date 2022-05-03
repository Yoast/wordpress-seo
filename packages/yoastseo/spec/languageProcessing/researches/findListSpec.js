import findList from "../../../src/languageProcessing/researches/findList";
import Paper from "../../../src/values/Paper.js";

describe( "A test for finding a list in a text", function() {
	it( "returns true if there is an unordered list in the text", function() {
		const mockPaper = new Paper( "This is a text with a list <ul style=\"list-style-type:disc\">\n" +
			"  <li>Coffee</li>\n" +
			"  <li>Tea</li>\n" +
			"  <li>Milk</li>\n" +
			"</ul> and more text after the list" );
		expect( findList( mockPaper ) ).toEqual( true );
	} );
	it( "returns true if there is an ordered list in the text", function() {
		const mockPaper = new Paper( "This is a text with a list <ol type=\"i\">\n" +
			"  <li>Coffee</li>\n" +
			"  <li>Tea</li>\n" +
			"  <li>Milk</li>\n" +
			"</ol> and more text after the list." );
		expect( findList( mockPaper ) ).toEqual( true );
	} );
	it( "returns false if there is no list in the text", function() {
		const mockPaper = new Paper( "This is a text with no list. Though there is a list closing tag </ul>. And even an opening tag <ul>." );
		expect( findList( mockPaper ) ).toEqual( false );
	} );
} );
