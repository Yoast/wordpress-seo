import {
	stripFullTags as stripHTMLTags,
	stripIncompleteTags as stripTagParts,
	stripBlockTagsAtStartEnd,
} from "../../../../src/languageProcessing/helpers/sanitize/stripHTMLTags.js";

describe( "Strips the HTML tags from a string.", function() {
	it( "returns a string without HTML tags", function() {
		expect( stripHTMLTags( "this is a textstring" ) ).toBe( "this is a textstring" );
		expect( stripHTMLTags( "this is a <span>textstring</span>" ) ).toBe( "this is a textstring" );
		expect( stripHTMLTags( "this is a <span class='yolo'>textstring</span>" ) ).toBe( "this is a textstring" );
		expect( stripHTMLTags( "<p>test</p>" ) ).toBe( "test" );
		expect( stripHTMLTags( "<p></p>" ) ).toBe( "" );
		expect( stripHTMLTags( "<span>test</span>" ) ).toBe( "test" );
		expect( stripHTMLTags( "<span></span>" ) ).toBe( "" );
		expect( stripHTMLTags( "<li>test</li>" ) ).toBe( "test" );
		expect( stripHTMLTags( "<li></li>" ) ).toBe( "" );
		expect( stripHTMLTags( "<span><b>this is</b> </span> a <p>textstring</p>" ) ).toBe( "this is a textstring" );
		expect( stripHTMLTags( "this    <b> is    a </b> textstring" ) ).toBe( "this is a textstring" );
		expect( stripHTMLTags( "this is <a href='text'>an anchor</a>" ) ).toBe( "this is an anchor" );
	} );
} );

describe( "Strips the HTML tag parts at the beginning of the sentence.", function() {
	it( "returns a string without the HTML closing tags at the start", function() {
		expect( stripTagParts( "this is a textstring" ) ).toBe( "this is a textstring" );
		expect( stripTagParts( "</span>this is a textstring" ) ).toBe( "this is a textstring" );
		expect( stripTagParts( "</strong></span>this is a textstring" ) ).toBe( "this is a textstring" );
	} );
	it( "returns a string without the HTML start tags at the end", function() {
		expect( stripTagParts( "this is a textstring<span>" ) ).toBe( "this is a textstring" );
		expect( stripTagParts( "this is a textstring<strong><span>" ) ).toBe( "this is a textstring" );
	} );
	it( "should return the same string", function() {
		expect( stripTagParts( "this is a textstring" ) ).toBe( "this is a textstring" );
		expect( stripTagParts( "<span>this is a textstring</span>" ) ).toBe( "<span>this is a textstring</span>" );
		expect( stripTagParts( "</strong><span>this is a textstring</span>" ) ).toBe( "<span>this is a textstring</span>" );
	} );
} );

describe( "Strips the block element tags at the beginning and end of a string.", function() {
	it( "returns a string without the block elements", function() {
		expect( stripBlockTagsAtStartEnd( "This is the first group" ) ).toBe( "This is the first group" );
		expect( stripBlockTagsAtStartEnd( "<h4>This is the first group</h4>" ) ).toBe( "This is the first group" );
	} );
} );
