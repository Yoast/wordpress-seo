var firstParagraph = require( "../../js/researches/findKeywordInFirstParagraph.js" );
var Paper = require( "../../js/values/Paper.js" );


describe( "checks for the keyword in the first paragraph", function(){
	it( "returns the number of matches", function(){

		expect( firstParagraph( new Paper( "<p>keyword</p>", {keyword:"keyword"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>text</p> keyword", {keyword:"keyword"} ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p>test</p><p>keyword</p>", {keyword:"keyword"} ) ) ).toBe( 0 );
		expect( firstParagraph(new Paper(  "dit is een keyword test \n\n ", {keyword:"keyword"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "keyword\n\ntext", {keyword:"keyword"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "dit is een test \n\n keyword", {keyword:"keyword"} ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "dit is een test keyword", {keyword:"keyword"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p class='p'>keyword</p>", {keyword:"keyword"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<table><tr><td>keyword</td></tr></table>", {keyword:"keyword"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a kapaklı</p>", {keyword:"kapaklı"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a key-word</p>", {keyword:"key-word"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a key-word</p>", {keyword:"key_word"} ) ) ).toBe( 0 );
		expect( firstParagraph( new Paper( "<p>this is a key_word</p>", {keyword:"key_word"} ) ) ).toBe( 1 );
		expect( firstParagraph( new Paper( "<p>this is a key_word</p>", {keyword:"key word"} ) ) ).toBe( 0 );
	});
});
