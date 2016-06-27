var countSyllableFunction = require("../../js/stringProcessing/countSyllables.js");

describe("a syllable counter for textstrings", function(){
	it( "returns the number of syllables", function(){
		expect( countSyllableFunction("this is a textstring") ).toBe( 5 );
		expect( countSyllableFunction("human beings") ).toBe( 4 );
		expect( countSyllableFunction("along the shoreline") ).toBe( 5 );
		expect( countSyllableFunction("A piece of text to calculate scores") ).toBe( 10 );

		expect( countSyllableFunction( "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite" ) ).toBe( 63 );
		expect( countSyllableFunction("One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble.") ).toBe( 65 );
		expect( countSyllableFunction("Bridger Pass is a mountain pass in Carbon County, Wyoming on the Continental Divide near the south Great Divide Basin bifurcation point, i.e., the point at which the divide appears to split and envelop the basin.") ).toBe( 57 );
		expect( countSyllableFunction("A test based on exclusionwords for syllablecount") ).toBe( 14 );
	});
});

describe( "counting syllables", function() {
	it( "returns the number of syllables in an exclusion word", function(){
		expect( countSyllableFunction( "shoreline") ).toBe( 2 );
		expect( countSyllableFunction( "business" ) ).toBe( 2 );
	});
	it( "returns the number of syllables in normal word", function(){

	})
});
