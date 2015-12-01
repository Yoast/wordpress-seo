var arrayToRegex = require( "../../js/stringProcessing/arrayToRegex.js" );

describe("a test creating a regex from an array with strings", function(){
	it("adds start and end boundaries", function(){
		expect(["a,b,c,d"]).toBe("");
	});
});