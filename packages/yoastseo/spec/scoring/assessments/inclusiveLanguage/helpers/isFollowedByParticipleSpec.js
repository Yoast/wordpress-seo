import {
	isParticiple,
	isFollowedByParticiple,
} from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/isFollowedByParticiple";

describe( "test the isParticiple function", () => {
	it( "returns true if a word is a regular participle", () => {
		expect( isParticiple( "worked" ) ).toBeTruthy();
	} );
	it( "returns true if a word is an irregular participle", () => {
		expect( isParticiple( "awoken" ) ).toBeTruthy();
	} );
	it( "returns false if a word is not a participle", () => {
		expect( isParticiple( "cat" ) ).toBeFalsy();
	} );
} );

describe( "test isFollowedByParticiple and isNotFollowedByParticiple", () => {
	it( "returns the right value when term is followed by a participle", () => {
		const words = "the man was worked".split( " " );
		const consecutiveWords = [ "man", "was" ];
		const callback = isFollowedByParticiple( words, consecutiveWords );
		const index = 1;


		expect( callback( index ) ).toEqual( true );
	} );
	it( "returns the right value when term is NOT followed by a participle", () => {
		const words = "the man was happy".split( " " );
		const consecutiveWords = [ "man", "was" ];
		const callback = isFollowedByParticiple( words, consecutiveWords );
		const index = 1;


		expect( callback( index ) ).toEqual( false );
	} );
} );
