var removeSpaces = require( "../../js/stringProcessing/removeNonWordCharacters.js" );

describe("a test removing spaces from a string", function(){
	it("returns string without spaces", function(){
		expect( removeSpaces(" test ") ).toBe( "test" );
	});
});