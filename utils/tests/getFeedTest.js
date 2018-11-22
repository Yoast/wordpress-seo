import { parseFeed } from "../getFeed";
import fs from "fs";

describe( "parseFeed", () => {
	const raw = fs.readFileSync( "./utils/tests/rssFeed.xml" );

	it( "parses the meta of a RSS feed.", () => {
		parseFeed( raw ).then( function( result ) {
			expect( result.title ).toBe( "WordPress" );
			expect( result.description ).toBe( "Just another WordPress site" );
			expect( result.link ).toBe( "http://local.wordpress.dev" );
		} );
	} );

	it( "parses the items of a RSS feed.", () => {
		parseFeed( raw ).then( function( result ) {
			expect( result.items.length ).toBe( 5 );

			expect( result.items[ 0 ].title ).toBe( "test2" );
			expect( result.items[ 0 ].link ).toBe( "http://local.wordpress.dev/test-url2/" );

			// Can not be tested because Node seems incapable of dealing with namespaced xpath queries.
			// Expect( result.items[0].creator ).toBe( 'author' );
			//	Xpect( result.items[0].content ).toContain( '<p>Foo bar baz</p>' );

			// Can not be tested because Node seems incapable of dealing with CDATA[*] content.
			// Expect( result.items[0].description ).toMatch( '<p>Foo bar baz</p>' );
		} );
	} );

	it( "returns a maximum number of items.", () => {
		parseFeed( raw, 2 ).then( function( result ) {
			expect( result.items.length ).toBe( 2 );

			expect( result.items[ 0 ].title ).toBe( "test2" );
			expect( result.items[ 0 ].link ).toBe( "http://local.wordpress.dev/test-url2/" );

			// Can not be tested because Node seems incapable of dealing with namespaced xpath queries.
			// Expect( result.items[0].creator ).toBe( 'author' );
			//	Xpect( result.items[0].content ).toContain( '<p>Foo bar baz</p>' );

			// Can not be tested because Node seems incapable of dealing with CDATA[*] content.
			// Expect( result.items[0].description ).toMatch( '<p>Foo bar baz</p>' );
		} );
	} );
} );
