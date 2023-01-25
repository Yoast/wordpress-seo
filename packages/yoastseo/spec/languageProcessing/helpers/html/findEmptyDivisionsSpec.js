import findEmptyDivision from "../../../../src/languageProcessing/helpers/html/findEmptyDivisions.js";

describe( "Checks the text for empty divisions", function() {
	it( "returns an empty array when no matches found", function() {
		expect( findEmptyDivision( "</div>The Norwegian alphabet read by a Norwegian, with the three most common pronunciations of R.</div>" ) )
			.toEqual( [] );
	} );
	it( "returns an array containing all empty divisions", function() {
		expect( findEmptyDivision( "<div id=\"siteSub\" class=\"noprint\">From Wikipedia, the free encyclopedia</div> " +
			"<div id=\"contentSub\"></div> <div id=\"contentSub2\"></div> <div id=\"jump-to-nav\"></div>" ) ).toEqual( [
			"<div id=\"contentSub\"></div>", "<div id=\"contentSub2\"></div>", "<div id=\"jump-to-nav\"></div>",
		] );
	} );
} );
