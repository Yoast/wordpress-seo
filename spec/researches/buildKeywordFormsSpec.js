const buildKeywordForms = require( "../../js/researches/buildKeywordForms.js" );
const includes = require( "lodash/includes" );
const Paper = require( "../../js/values/Paper.js" );
let result;
let mockPaper;

describe( "Return the received keyword for a language that is not added to the morphology module", function() {
	it( "returns the keyword and possible alternations with respect to normalized/non-normalized apostrophe", function() {
		mockPaper = new Paper( "", { keyword: "слово", locale: "ru_RU" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "слово" ) );

		mockPaper = new Paper( "", { keyword: "слово'слово", locale: "ru_RU" } );
		result = buildKeywordForms( mockPaper );

		expect( result ).toEqual( [].concat( "слово'слово", "слово‘слово", "слово’слово", "слово‛слово", "слово`слово" ) );
	} );
} );

describe( "Build keyword forms based on the received keyword for English", function() {
	it( "returns the forms", function() {
		mockPaper = new Paper( "", { keyword: "keyword", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "keyword" );
		expect( result ).toContain( "keywords" );
		expect( result ).toContain( "keyword's" );
		expect( result ).toContain( "keywords'" );
		expect( result ).toContain( "keywords's" );
		expect( result ).toContain( "keyword’s" );
		expect( result ).toContain( "keyword‘s" );
		expect( result ).toContain( "keyword‛s" );
		expect( result ).toContain( "keyword`s" );
		expect( result ).toContain( "keywords’" );
		expect( result ).toContain( "keywords'" );
		expect( result ).toContain( "keywords`" );
		expect( result ).toContain( "keywords‘" );
		expect( result ).toContain( "keywords‛" );
		expect( result ).toContain( "keywords’s" );
		expect( result ).toContain( "keywords's" );
		expect( result ).toContain( "keywords`s" );
		expect( result ).toContain( "keywords‘s" );
		expect( result ).toContain( "keywords‛s" );

		mockPaper = new Paper( "", { keyword: "Keyword", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "keyword" );
		expect( result ).toContain( "keywords" );


		mockPaper = new Paper( "", { keyword: "\"keyword\"", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "keyword" ) );

		mockPaper = new Paper( "", { keyword: "\"Keyword\"", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "Keyword" ) );

		mockPaper = new Paper( "", { keyword: "\"keyword and keyphrases\"", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toEqual( [].concat( "keyword and keyphrases" ) );

		mockPaper = new Paper( "", { keyword: "keyword and keyphrases", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "keyword" );
		expect( result ).toContain( "keywords" );
		expect( result ).toContain( "keyphrase" );
		expect( result ).toContain( "keyphrases" );
		const whetherResultContainsWord = includes( result, "and" );
		expect( whetherResultContainsWord ).toBe( false );

		mockPaper = new Paper( "", { keyword: "One and two", locale: "en_EN" } );
		result = buildKeywordForms( mockPaper );
		expect( result ).toContain( "one" );
		expect( result ).toContain( "ones" );
		expect( result ).toContain( "and" );
		expect( result ).toContain( "ands" );
		expect( result ).toContain( "two" );
		expect( result ).toContain( "twos" );
	} );
} );
