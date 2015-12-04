var exclusionSyllables = require("../../js/stringProcessing/exclusionSyllable.js");

describe("counts syllables from exclusionwords", function(){
	it("returns the amount of syllables in the textstring", function(){
		expect( exclusionSyllables( "along the shoreline")).toBe( 2 );
		expect( exclusionSyllables( "teststring is zero")).toBe( 0 );
	});
});