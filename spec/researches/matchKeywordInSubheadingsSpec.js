import subheadingFunction from "../../src/researches/matchKeywordInSubheadings.js";
import Paper from "../../src/values/Paper.js";

describe( "a test for matching subheadings", function() {
	it( "returns the number of subheadings in the text", function() {
		var mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		var result = subheadingFunction( mockPaper );
		expect( result.count ).toBe( 1 );

		mockPaper = new Paper( "Pellentesque sit amet justo ex. Suspendisse feugiat pulvinar leo eu consectetur" );
		result = subheadingFunction( mockPaper );
		expect( result.count ).toBe( 0 );

		mockPaper = new Paper( "<h2>Lorem ipsum</h2><h2>Lorem ipsum</h2><h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		result = subheadingFunction( mockPaper );
		expect( result.count ).toBe( 3 );
	} );
} );

describe( "A test for matching keywords in subheadings", function() {
	it( "returns the number of matches in a subheading", function() {
		var mockPaper = new Paper( "<h2>Lorem ipsum $keyword</h2>", { keyword: "$keyword" } );
		var result = subheadingFunction( mockPaper );
		expect( result.matches ).toBe( 1 );
	} );
} );

describe( "a test for matching keywords in subheadings", function() {
	it( "returns the number of matches in the subheadings", function() {
		var mockPaper = new Paper( "<h2>Lorem ipsum</h2> keyword sit amet, consectetur adipiscing elit", { keyword: "keyword" } );
		var result = subheadingFunction( mockPaper );
		expect( result.count ).toBe( 1 );
		expect( result.matches ).toBe( 0 );

		mockPaper = new Paper( "Pellentesque sit amet justo ex. Suspendisse feugiat pulvinar leo eu consectetur" );
		result = subheadingFunction( mockPaper );
		expect( result.count ).toBe( 0 );

		mockPaper = new Paper( "<h2>this is a heading with a diacritic keyword kapaklı </h2>", { keyword: "kapaklı" } );
		result = subheadingFunction( mockPaper );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with a dashed key-word</h2>", { keyword: "key-word" } );
		result = subheadingFunction( mockPaper );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with a underscored key_word</h2>", { keyword: "key_word" } );
		result = subheadingFunction( mockPaper );
		expect( result.matches ).toBe( 1 );

		mockPaper = new Paper( "<h2>this is a heading with a underscored key-word</h2>", { keyword: "key word" } );
		result = subheadingFunction( mockPaper );
		expect( result.matches ).toBe( 0 );

		mockPaper = new Paper( "<h2>this is a heading with a underscored key_word</h2>", { keyword: "key word" } );
		result = subheadingFunction( mockPaper );
		expect( result.matches ).toBe( 0 );
	} );
} );
