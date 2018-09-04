import syllableCountIterator from '../../src/helpers/syllableCountIterator.js';

describe( "creating a language syllable regex master", function() {
	it( "returns an empty language syllable regex master", function() {
		var mockMaster = new syllableCountIterator();
		expect( mockMaster.getAvailableSyllableCountSteps().length ).toBe( 0 );
	} );


	it( "returns an empty language syllable regex master", function() {
		var mockConfig = {
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
		var mockMaster = new syllableCountIterator( mockConfig );
		expect( mockMaster.getAvailableSyllableCountSteps().length ).toBe( 2 );
		expect( mockMaster.countSyllables( "a" ) ).toBe( -1 );
		expect( mockMaster.countSyllables( "bb" ) ).toBe( 2 );
	} );
} );
