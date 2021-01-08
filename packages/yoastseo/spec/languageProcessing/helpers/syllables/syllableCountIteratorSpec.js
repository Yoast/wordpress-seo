import SyllableCountIterator from "../../../../src/languageProcessing/helpers/syllables/syllableCountIterator.js";

describe( "a test to create a language syllable regex master", function() {
	it( "returns an empty language syllable regex master if there is no config available", function() {
		const mockMaster = new SyllableCountIterator();
		expect( mockMaster.getAvailableSyllableCountSteps().length ).toBe( 0 );
	} );


	it( "returns a language syllable regex master", function() {
		const mockConfig = {
			deviations: {
				vowels: [
					{
						fragments: [ "a" ],
						countModifier: -1,
					},
					{
						fragments: [ "b" ],
						countModifier: +1,
					},
				],
			},
		};
		const mockMaster = new SyllableCountIterator( mockConfig );
		expect( mockMaster.getAvailableSyllableCountSteps().length ).toBe( 2 );
		expect( mockMaster.countSyllables( "a" ) ).toBe( -1 );
		expect( mockMaster.countSyllables( "bb" ) ).toBe( 2 );
	} );
} );
