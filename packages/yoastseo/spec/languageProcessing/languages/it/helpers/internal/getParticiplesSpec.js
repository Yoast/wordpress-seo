import getParticiples from "../../../../../../src/languageProcessing/languages/it/helpers/internal/getParticiples.js";

describe( "Test for matching Italian participles", function() {
	it( "returns matched irregular participles.", function() {
		const sentencePartText = "Venivano salvati dal bagnino.";
		const auxiliaries = [ "venivano" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "salvati" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Venivano salvati dal bagnino." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "venivano" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const sentencePartText = "Sto mangiando una mela.";
		const auxiliaries = [];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
