var arrayMatch = require( "../../js/stringProcessing/matchTextWithArray.js" );

describe("a test matching strings in an array", function(){
	it("returns the matches in the array", function(){
		expect( arrayMatch( "this is a test with words.", [ "test", "string", "words" ] ) ).toEqual( [ 'test', 'words' ] );
		expect( arrayMatch( "this is a test with words.", [ "something" ] ) ).toEqual( [] );
	});
});