var getSentences = require( "../../js/stringProcessing/getSentences.js" );
describe("Get sentences from text", function(){
	it("returns sentences", function () {
		var sentence = "Hello. How are you? Bye";
		expect( getSentences( sentence )[0] ).toBe( "hello");
		expect( getSentences( sentence )[1] ).toBe( " how are you");
		expect( getSentences( sentence )[2] ).toBe( " bye");
	})
});