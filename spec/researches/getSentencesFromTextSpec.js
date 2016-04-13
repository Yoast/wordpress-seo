var getSentences = require( "../../js/researches/getSentencesFromText.js" );
var Paper = require( "../../js/values/Paper" );

describe("Get sentences from text", function(){
	it("returns sentences with question mark", function () {
		var paper = new Paper("Hello. How are you? Bye");
		expect( getSentences( paper )[0] ).toBe( "hello");
		expect( getSentences( paper )[1] ).toBe( " how are you");
		expect( getSentences( paper )[2] ).toBe( " bye");
	});
	it("returns sentences with exclamation mark", function () {
		paper = new Paper("Hello. How are you! Bye");
		expect( getSentences( paper )[0] ).toBe( "hello");
		expect( getSentences( paper )[1] ).toBe( " how are you");
		expect( getSentences( paper )[2] ).toBe( " bye");
	})
	it("returns sentences with many spaces", function () {
		paper = new Paper("Hello.        How are you! Bye");
		expect( getSentences( paper )[0] ).toBe( "hello");
		expect( getSentences( paper )[1] ).toBe( " how are you");
		expect( getSentences( paper )[2] ).toBe( " bye");
	})
});