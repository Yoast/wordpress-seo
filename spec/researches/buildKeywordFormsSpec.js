const buildKeywordForms = require( "../../js/researches/buildKeywordForms.js" );
const includes = require( "lodash/includes" );
const Paper = require( "../../js/values/Paper.js" );
let result;
let mockPaper;

describe( "Build keyword forms based on the received keyword", function() {
	it( "returns number of matches and position", function() {
		mockPaper = new Paper( "", { keyword: "keyword" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "keyword" );
		expect( result ).toContain( "keywords" );

		mockPaper = new Paper( "", { keyword: "Keyword" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "keyword" );
		expect( result ).toContain( "keywords" );


		mockPaper = new Paper( "", { keyword: "\"keyword\"" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "keyword" ) );

		mockPaper = new Paper( "", { keyword: "\"Keyword\"" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "Keyword" ) );

		mockPaper = new Paper( "", { keyword: "\"keyword and keyphrases\"" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "keyword and keyphrases" ) );

		mockPaper = new Paper( "", { keyword: "keyword and keyphrases" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "keyword" );
		expect( result ).toContain( "keywords" );
		expect( result ).toContain( "keyphrase" );
		expect( result ).toContain( "keyphrases" );
		const whetherResultContainsWord = includes( result, "and" );
		expect( whetherResultContainsWord ).toBe( false );
	} );
} );
