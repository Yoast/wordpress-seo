var stripHTMLTags = require( "../../js/stringProcessing/stripHTMLTags.js" ).stripFullTags;
var stripTagParts = require( "../../js/stringProcessing/stripHTMLTags.js" ).stripIncompleteTags;

describe( "strips the HTMLtags from a string", function(){
	it( "returns a string without HTMLtags", function(){
		expect(stripHTMLTags( "this is a textstring" ) ).toBe( "this is a textstring" );
		expect(stripHTMLTags( "this is a <span>textstring</span>" ) ).toBe( "this is a textstring" );
		expect(stripHTMLTags( "this is a <span class='yolo'>textstring</span>" ) ).toBe( "this is a textstring" );
		expect(stripHTMLTags( "<p>test</p>")).toBe( "test" );
		expect(stripHTMLTags( "<p></p>")).toBe( "" );
		expect(stripHTMLTags( "<span>test</span>")).toBe( "test" );
		expect(stripHTMLTags( "<span></span>")).toBe( "" );
		expect(stripHTMLTags( "<li>test</li>")).toBe( "test" );
		expect(stripHTMLTags( "<li></li>")).toBe( "" );
		expect(stripHTMLTags( "<span><b>this is</b> </span> a <p>textstring</p>" )).toBe( "this is a textstring" );
		expect(stripHTMLTags( "this    <b> is    a </b> textstring" )).toBe( "this is a textstring" );
		expect(stripHTMLTags( "this is <a href='text'>an anchor</a>" )).toBe( "this is an anchor" );
	} );
} );

describe( "strips the HTML tag parts at the beginning of the sentence", function() {
	it( "returns a string without the HTML closing tags at the start", function() {
		expect( stripTagParts ( "this is a textstring") ).toBe( "this is a textstring" );
		expect( stripTagParts ( "</span>this is a textstring") ).toBe( "this is a textstring" );
		expect( stripTagParts ( "</strong></span>this is a textstring") ).toBe( "this is a textstring" );
	} );
	it( "returns a string without the HTML start tags at the end", function() {
		expect( stripTagParts ( "this is a textstring<span>") ).toBe( "this is a textstring" );
		expect( stripTagParts ( "this is a textstring<strong><span>") ).toBe( "this is a textstring" );
	} );
	it( "should return the same string", function(){
		expect( stripTagParts( "this is a textstring" ) ).toBe( "this is a textstring" );
		expect( stripTagParts( "<span>this is a textstring</span>" ) ).toBe( "<span>this is a textstring</span>" );
		expect( stripTagParts( "</strong><span>this is a textstring</span>" ) ).toBe( "<span>this is a textstring</span>" );
	});
} );
