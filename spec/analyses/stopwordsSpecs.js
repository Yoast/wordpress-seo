var stopwordsFunction = require( "../../js/analyses/checkStringForStopwords.js" );

describe("a test for finding stopwords from a string", function(){
	it("returns stopwords found in a string", function(){
		expect( stopwordsFunction( "this is a story about..." ) ).toContain( "a" );
		expect( stopwordsFunction( "this is a story about..." ) ).toContain( "about" );
		expect( stopwordsFunction( "this is a story about..." ) ).toContain( "this" );
		expect( stopwordsFunction( "tell about yourself" ) ).toContain( "about" );
		expect( stopwordsFunction( "tell about yourself" ) ).toContain( "yourself" );
		expect( stopwordsFunction( "niets bijzonders").length ).toBe( 0 );
	});
});