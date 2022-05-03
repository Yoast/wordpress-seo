import SyllableCountStep from "../../../../src/languageProcessing/helpers/syllables/syllableCountStep.js";

describe( "A test for creating a language syllable regex", function() {
	it( "creates an empty language syllable regex", function() {
		const languageSyllableRegex = new SyllableCountStep();
		expect( languageSyllableRegex.hasRegex() ).toBe( false );
	} );

	it( "creates an language syllable regex with a +1 multiplier", function() {
		const mockSyllables = {
			fragments: [ "a" ],
			countModifier: +1,
		};
		const languageSyllableRegex = new SyllableCountStep( mockSyllables );
		expect( languageSyllableRegex.countSyllables( "a" ) ).toBe( 1 );
		expect( languageSyllableRegex.countSyllables( "b" ) ).toBe( 0 );

		expect( languageSyllableRegex.getRegex() ).toEqual( /(a)/gi );
	} );

	it( "creates an language syllable regex with a +1 multiplier", function() {
		const mockSyllables = {
			fragments: [ "ee" ],
			countModifier: -2,
		};
		const languageSyllableRegex = new SyllableCountStep( mockSyllables );
		expect( languageSyllableRegex.countSyllables( "been seen" ) ).toBe( -4 );

		expect( languageSyllableRegex.getRegex() ).toEqual( /(ee)/gi );
	} );

	it( "will not count syllables without a regex", function() {
		const countStep = new SyllableCountStep();

		expect( countStep.countSyllables( "word" ) ).toBe( 0 );
	} );
} );

