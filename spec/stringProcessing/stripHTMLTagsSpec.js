var stripHTMLTags = require( "../../js/stringProcessing/stripHTMLTags.js" );

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
