import { stripWordBoundariesStart } from "../../src/languages/legacy/stringProcessing/stripWordBoundaries.js";
import { stripWordBoundariesEnd } from "../../src/languages/legacy/stringProcessing/stripWordBoundaries.js";
import { stripWordBoundariesEverywhere } from "../../src/languages/legacy/stringProcessing/stripWordBoundaries.js";

describe( "function to remove word boundaries from words", function() {
	it( "returns a string with word boundaries in the beginning of the word removed", function() {
		expect( stripWordBoundariesStart( "?keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( ".keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( ",keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "'keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "(keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( ")keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "\"keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "+keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "-keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( ";keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "!keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "?keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( ":keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "/keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "»keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "«keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "‹keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "›keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( "<keyword" ) ).toBe( "keyword" );
		expect( stripWordBoundariesStart( ">keyword" ) ).toBe( "keyword" );

		expect( stripWordBoundariesStart( ">! \"keyword" ) ).toBe( "keyword" );

		expect( stripWordBoundariesStart( "keyword" ) ).toBe( "keyword" );
	} );

	it( "returns a string with word boundaries in the end of the word removed", function() {
		expect( stripWordBoundariesEnd( "keyword." ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword," ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword'" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword(" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword)" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword\"" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword+" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword-" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword;" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword!" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword?" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword:" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword/" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword»" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword«" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword‹" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword›" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword<" ) ).toBe( "keyword" );
		expect( stripWordBoundariesEnd( "keyword>" ) ).toBe( "keyword" );

		expect( stripWordBoundariesEnd( "keyword< ?." ) ).toBe( "keyword" );

		expect( stripWordBoundariesEnd( "keyword" ) ).toBe( "keyword" );
	} );

	it( "returns a string with word-final boundaries removed in an RTL script", function() {
		// Arabic comma
		expect( stripWordBoundariesEnd( "المقاومة،" ) ).toBe( "المقاومة" );
		// Arabic question mark
		expect( stripWordBoundariesEnd( "الجيدة؟" ) ).toBe( "الجيدة" );
		// Arabic semicolon
		expect( stripWordBoundariesEnd( "الجيدة؛" ) ).toBe( "الجيدة" );
		// Urdu full stop
		expect( stripWordBoundariesEnd( "گئے۔" ) ).toBe( "گئے" );
	} );

	it( "returns a string with word boundaries in the end of the word removed", function() {
		expect( stripWordBoundariesEverywhere( "?keyword " ) ).toBe( "keyword" );
		expect( stripWordBoundariesEverywhere( "keyword" ) ).toBe( "keyword" );
	} );
} );
