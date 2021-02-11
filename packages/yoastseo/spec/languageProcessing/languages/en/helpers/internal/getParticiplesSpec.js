import getParticiples from "../../../../../../src/languageProcessing/languages/en/helpers/internal/getParticiples";

describe( "Test for matching English participles", function() {
	it( "returns matched regular participles.", function() {
		const sentencePartText = "The cats are loved.";
		const auxiliaries = [ "are", "is" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual(  "loved" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "The cats are loved." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "are", "is" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "en" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles.", function() {
		const sentencePartText = "The cats were given.";
		const auxiliaries = [ "were", "was" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "given" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "The cats were given." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "were", "was" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "en" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		const sentencePartText = "The cats are special.";
		const auxiliaries = [ "are", "is" ];
		expect( getParticiples( sentencePartText, auxiliaries ) ).toEqual( [] );
		expect( getParticiples( "", auxiliaries ) ).toEqual( [] );
	} );
} );
