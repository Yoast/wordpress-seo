var arrayMatch = require( "../../js/stringProcessing/arrayMatch.js" );

describe("a test matching strings in an array", function(){
	it("returns the matches in the array", function(){
		result = arrayMatch( "this is a test with words.", [ "test", "string", "words" ] );
		expect( result ).toEqual( [ 'test', 'words' ] );
	});
});