var removeExclusionWords = require("../../js/stringProcessing/removeExclusionWords.js");

describe("removes exclusionwords from string", function(){
	it("returns strint with removed words", function(){
		expect( removeExclusionWords( "along the shoreline" ) ).toBe( "along the" );
	});
});