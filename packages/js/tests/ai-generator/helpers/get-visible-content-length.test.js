import { getVisibleContentLength } from "../../../src/ai-generator/helpers";

describe( "getVisibleContentLength", () => {
	it( "should return 0 for an empty string", () => {
		expect( getVisibleContentLength( "" ) ).toBe( 0 );
	} );

	it( "should return 0 for a missing content", () => {
		expect( getVisibleContentLength( undefined ) ).toBe( 0 );
	} );

	it( "should count the visible text of a plain string", () => {
		expect( getVisibleContentLength( "Hello world" ) ).toBe( 11 );
	} );

	it( "should not count HTML tags", () => {
		expect( getVisibleContentLength( "<p>Hello world</p>" ) ).toBe( 11 );
	} );

	it( "should not count block comments", () => {
		expect( getVisibleContentLength( "<!-- wp:paragraph --><p>Hello world</p><!-- /wp:paragraph -->" ) ).toBe( 11 );
	} );

	it( "should not let markup push a short post over the default threshold", () => {
		// Seven paragraph blocks: 364 characters of markup around 14 characters of visible text.
		const content = "<!-- wp:paragraph --><p>Hi</p><!-- /wp:paragraph -->".repeat( 7 );

		expect( content.length ).toBeGreaterThan( 300 );
		expect( getVisibleContentLength( content ) ).toBeLessThanOrEqual( 300 );
	} );

	it( "should count a genuinely long post as long", () => {
		const content = "<!-- wp:paragraph --><p>" + "a".repeat( 301 ) + "</p><!-- /wp:paragraph -->";

		expect( getVisibleContentLength( content ) ).toBe( 301 );
	} );

	it( "should collapse whitespace and non-breaking spaces", () => {
		expect( getVisibleContentLength( "<p>Hello   world</p>" ) ).toBe( 11 );
	} );
} );
