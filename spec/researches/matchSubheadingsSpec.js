var subheadingFunction = require("../../js/researches/matchKeywordInSubheadings.js");
var Paper = require( "../../js/values/Paper.js" );

describe("a test for matching subheadings", function(){
	it("returns the number of subheadings in the text", function(){
		var mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", {keyword: "keyword" } );
		var result = subheadingFunction( mockPaper );
		expect( result.count ).toBe(1);

		mockPaper = new Paper( "Pellentesque sit amet justo ex. Suspendisse feugiat pulvinar leo eu consectetur" );
		result = subheadingFunction( mockPaper );
		expect( result.count ).toBe(0);

		mockPaper = new Paper( "<h2>Lorem ipsum</h2><h2>Lorem ipsum</h2><h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", {keyword: "keyword" } );
		result = subheadingFunction( mockPaper );
		expect( result.count ).toBe(3);
	});
});
