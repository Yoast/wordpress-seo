var firstParagraph = require( "../../js/analyses/findKeywordInFirstParagraph.js" );

describe( "checks for the keyword in the first paragraph", function(){
	it( "returns the number of matches", function(){
		expect( firstParagraph( "<p>keyword</p>", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "<p>text</p> keyword", "keyword" ) ).toBe( 0 );
		expect( firstParagraph( "<p>test</p><p>keyword</p>", "keyword" ) ).toBe( 0 );
		expect( firstParagraph( "dit is een keyword test \n\n ", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "keyword\n\ntext", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "dit is een test \n\n keyword", "keyword" ) ).toBe( 0 );
		expect( firstParagraph( "dit is een test keyword", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "<p class='p'>keyword</p>", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "<table><tr><td>keyword</td></tr></table>", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "<p>this is a key-word</p>", "key-word" ) ).toBe( 1 );
	});
});
