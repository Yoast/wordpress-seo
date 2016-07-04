var languageSyllableRegexMaster = require(  "../../js/values/syllableCountIterator.js" );

describe( "creating a language syllable regex master", function() {
	it( "returns an empty language syllable regex master", function() {
		var mockMaster = new languageSyllableRegexMaster();
		expect( mockMaster.getAvailableLanguageSyllableRegexes().length ).toBe( 0 );
	} );


	it( "returns an empty language syllable regex master", function() {
		var mockConfig = {
			syllableExclusion: {
				subtractSyllables: {
					syllables: [ "a" ],
					multiplier: -1
				},
				addSyllables: {
					syllables: [ "b"],
					multiplier: +1
				}
			}
		};
		var mockMaster = new languageSyllableRegexMaster( mockConfig );
		expect( mockMaster.getAvailableLanguageSyllableRegexes().length ).toBe( 2 );
		expect( mockMaster.countSyllables( "a" ) ).toBe ( -1 );
		expect( mockMaster.countSyllables( "bb" ) ).toBe ( 2 );
	} )

} );
