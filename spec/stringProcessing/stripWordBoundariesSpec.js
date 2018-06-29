const stripWordBoundariesStart = require( "../../js/stringProcessing/stripWordBoundaries.js" ).stripWordBoundariesStart;
const stripWordBoundariesEnd = require( "../../js/stringProcessing/stripWordBoundaries.js" ).stripWordBoundariesEnd;
const stripWordBoundariesEverywhere = require( "../../js/stringProcessing/stripWordBoundaries.js" ).stripWordBoundariesEverywhere;

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

	const wordBoundary = "[ \\u00a0 \\n\\r\\t.,'()\"+-;!?:/»«‹›<>]";

	it( "returns a string with word boundaries in the end of the word removed", function() {
		expect( stripWordBoundariesEverywhere( "?keyword " ) ).toBe( "keyword" );
		expect( stripWordBoundariesEverywhere( "keyword" ) ).toBe( "keyword" );
	} );
} );
