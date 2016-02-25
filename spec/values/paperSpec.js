var Paper = require( "../../js/values/Paper.js" );

describe( "Creating an Paper", function(){
	it( "returns and empty keyword and text when no args are given", function() {
		var mockPaper = new Paper();

		expect( mockPaper.getKeyword() ).toBe( "" );
		expect( mockPaper.getText() ).toBe( "" );
	} );

	it( "returns and a valid keyword and text when args are given", function() {
		var mockPaper = new Paper( "text with keyword", { keyword: "keyword" } );

		expect( mockPaper.getKeyword() ).toBe( "keyword" );
		expect( mockPaper.getText() ).toBe( "text with keyword" );
	} );
} );

describe( "Creating a Paper", function() {
	it("returns metaDescription", function () {
		var metaValues = {};
		var paper = new Paper("text, metaValues");
		expect(paper.hasDescription()).toBe(false);
		expect(paper.getDescription()).toBe("");

		metaValues = {
			keyword: "keyword",
			description: "this is a meta"
		};
		paper = new Paper("text", metaValues);
		expect(paper.hasDescription()).toBe(true);
		expect(paper.getDescription()).toBe("this is a meta");
	});
} );