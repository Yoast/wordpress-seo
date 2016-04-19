var getParagraphLength = require("../../js/researches/getParagraphLength.js");
var Paper = require( "../../js/values/Paper.js" );


describe("a test for getting paragraph length", function(){
	it("returns the paragraph length of a paragraph between p tags", function(){
		var mockPaper = new Paper( "<p>Lorem ipsum</p>" );
		expect( getParagraphLength( mockPaper ) ).toContain( 2 );
	});

	it("returns the paragraph length of two paragraphs devided by double linebreaks and ends with double linebreak", function(){
		var mockPaper = new Paper( "Lorem \n\n ipsum two \n\n" );
		expect( getParagraphLength( mockPaper ) ).toContain( 1 );
		expect( getParagraphLength( mockPaper ) ).toContain( 2 );
	});

	it("returns the paragraph length of two paragraphs devided by double linebreaks and don't end with double linebreak", function(){
		var mockPaper = new Paper( "Lorem \n\n ipsum two" );
		expect( getParagraphLength( mockPaper ) ).toContain( 1 );
		expect( getParagraphLength( mockPaper ) ).toContain( 2 );
	});

	it("returns the paragraph length of a paragraph without tags or double linebreaks", function(){
		var mockPaper = new Paper( "Lorem ipsum dolor sit amet" );
		expect( getParagraphLength( mockPaper ) ).toContain( 5 );
	});

	it("returns the paragraph length of 2 paragraphs, both between p tags", function(){
		var mockPaper = new Paper( "<p>Lorem ipsum</p><p>dolor sit amet</p>" );
		expect( getParagraphLength( mockPaper ) ).toContain( 2 );
		expect( getParagraphLength( mockPaper ) ).toContain( 3 );
	});

	it("returns the paragraph length of 2 paragraphs, both between p tags", function(){
		var mockPaper = new Paper( "<p>Lorem ipsum</p> \n\n <p>dolor sit amet</p>" );
		expect( getParagraphLength( mockPaper ) ).toContain( 2 );
		expect( getParagraphLength( mockPaper ) ).toContain( 3 );
	});

	it("returns the paragraph length of paragraph without p tags or double linebreaks, but with h2 tags", function(){
		var mockPaper = new Paper( "<h2>Lorem ipsum dolor sit amet</h2>" );
		expect( getParagraphLength( mockPaper ) ).toContain( 5 );
	});

	it("returns the paragraph length of an empty paragraph with p tags", function(){
		var mockPaper = new Paper( "<p></p>" );
		expect( getParagraphLength( mockPaper ) ).not.toContain( 0 );
	});

	it("returns the paragraph length of an empty paragraph without p tags or double line breaks", function(){
		var mockPaper = new Paper( "" );
		expect( getParagraphLength( mockPaper ) ).not.toContain( 0 );
	});
});
