var pageTitleKeyword = require( "../../js/analyses/findKeywordInPageTitle.js" );
var Paper = require( "../../js/values/Paper.js" );
var result;

describe("Match keywords in string", function(){
	it("returns number of matches and position", function(){

		var mockPaper = new Paper( "", { keyword: "keyword", title: "keyword in a string" } );

		result = pageTitleKeyword( mockPaper );
		expect( result.matches ).toBe( 1 );
		expect( result.position ).toBe( 0 );

		var mockPaper = new Paper( "", { keyword: "keyword", title: "a string with a keyword and another keyword" } );
		result = pageTitleKeyword( mockPaper );
		expect( result.matches ).toBe( 2 );
		expect( result.position ).toBe( 16 );

		var mockPaper = new Paper( "", { keyword: "", title: "a string with words" } );
		result = pageTitleKeyword( mockPaper );
		expect( result.matches).toBe( 0 );

		var mockPaper = new Paper( "", { keyword: "нечто", title: "ст, чтобы проверить нечто Test текст, чтобы " } );
		result = pageTitleKeyword( mockPaper );
		expect( result.matches ).toBe( 1 );

		var mockPaper = new Paper( "", { keyword: "äbc", title: "äbc" } );
		result = pageTitleKeyword( mockPaper );
		expect( result.matches ).toBe( 1 );

		var mockPaper = new Paper( "", { keyword: "focus keyword", title: "focus-keyword" } );
		result = pageTitleKeyword( mockPaper );
		expect( result.matches ).toBe( 0 );
	});
});

