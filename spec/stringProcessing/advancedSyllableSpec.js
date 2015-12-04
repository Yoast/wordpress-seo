var advancedSyllable = require("../../js/stringProcessing/advancedSyllable.js");

describe("function to count syllables with advanced regex", function(){
	it("returns number of syllables that should be added to total", function(){
		expect( advancedSyllable( "being", "add" ) ).toBe(1);
		expect( advancedSyllable( "test", "add" ) ).toBe(0);
		expect( advancedSyllable( "year", "add" ) ).toBe(0);
	});
	it("returns number of syllables that should be subtracted from total", function(){
		expect( advancedSyllable( "here", "subtract" ) ).toBe(1);
		expect( advancedSyllable( "edge", "subtract" ) ).toBe(1);
	});
});
