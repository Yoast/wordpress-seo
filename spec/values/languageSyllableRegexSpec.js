var LanguageSyllableRegex = require( "../../js/values/syllableCountMethod.js" );

describe( "A test for creating a language syllable regex", function() {
	it( "creates an empty language syllable regex", function() {
		var languageSyllableRegex = new LanguageSyllableRegex();
		expect( languageSyllableRegex.hasRegex() ).toBe( false );
	} );

	it( "creates an language syllable regex with a +1 multiplier", function() {
		var mockSyllables = {
				syllables: [ "a" ],
				multiplier: +1
		};
		var languageSyllableRegex = new LanguageSyllableRegex( mockSyllables );
		expect( languageSyllableRegex.countSyllables( "a" ) ).toBe( 1 );
		expect( languageSyllableRegex.countSyllables( "b" ) ).toBe( 0 );

		expect( languageSyllableRegex.getRegex() ).toMatch( /(a)/gi );
	} );

	it( "creates an language syllable regex with a +1 multiplier", function() {
		var mockSyllables = {
			syllables: [ "ee" ],
			multiplier: -2
		};
		var languageSyllableRegex = new LanguageSyllableRegex( mockSyllables );
		expect( languageSyllableRegex.countSyllables( "been seen" ) ).toBe( -4 );

		expect( languageSyllableRegex.getRegex() ).toMatch( /(ee)/gi );
	} );
} );
