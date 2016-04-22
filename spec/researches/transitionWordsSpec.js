var transitionWordsResearch = require( "../../js/researches/findTransitionWords.js" );

describe("a test for finding transition words from a string", function(){
	it("returns a transition word found in in the middle of a string", function(){
		expect( transitionWordsResearch( "this is a story about a boy" ) ).toContain( "about" );
	});
	it("returns a transition word with capital, found at the beginning of a string", function(){
		expect( transitionWordsResearch( "Firstly, I'd like to say" ) ).toContain( "firstly" );
	});
	it("returns a transition word combination found in the middle of a string", function(){
		expect( transitionWordsResearch( "that is different from something else" ) ).toContain( "different from" );
	});
	it("returns a transition word combination found at the end of a string", function(){
		expect( transitionWordsResearch( "A story, for example" ) ).toContain( "for example" );
	});
	it("returns a transition word abbreviation found in a string", function(){
		expect( transitionWordsResearch( "that is e.g. a story..." ) ).toContain( "e.g." );
	});
		it("returns 2 transition words found in a string", function(){
		expect( transitionWordsResearch( "Firstly, I'd like to tell a story, for example" ) ).toContain( "firstly", "for example" );
	});
	it("returns no transition word from a string without transition words", function(){
		expect( transitionWordsResearch( "nothing special" ).length ).toBe( 0 );
	});
});
