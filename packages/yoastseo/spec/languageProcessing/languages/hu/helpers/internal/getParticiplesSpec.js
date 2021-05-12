import getParticiples from "../../../../../../src/languageProcessing/languages/hu/helpers/internal/getParticiples";

describe( "Test for matching Hungarian participles", function() {
	it( "returns matched participles with 've' at the end.", function() {
		const sentence = "Az autó le van fedve.";
		const auxiliaries = [ "van" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "fedve" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "ve at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Az autó le van fedve." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "van" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );

	it( "returns matched participles with 've' at the end followed by the auxiliary.", function() {
		const sentence = "Az asztal terítve van.";
		const auxiliaries = [ "van" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "terítve" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "ve at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Az asztal terítve van." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "van" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );

	it( "returns matched participles with 'va' at the end.", function() {
		const sentence = "A függöny ki van mosva.";
		const auxiliaries = [ "van" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "mosva" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "va at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "A függöny ki van mosva." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "van" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );

	it( "returns matched participles with 'ra' at the end.", function() {
		const sentence = "A fa kivágásra került.";
		const auxiliaries = [ "került" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "kivágásra" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "re/ra at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "A fa kivágásra került." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "került" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );

	it( "returns matched participles with 're' at the end.", function() {
		const sentence = "Az épület megvételre került.";
		const auxiliaries = [ "került" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "megvételre" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "re/ra at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Az épület megvételre került." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "került" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );

	it( "returns matched participles with 'ódni' at the end.", function() {
		const sentence = "A probléma meg fog oldódni.";
		const auxiliaries = [ "fog" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "oldódni" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "ódni at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "A probléma meg fog oldódni." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fog" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );

	it( "returns matched participles with 'ődni' at the end.", function() {
		const sentence = "Az ügy rosszul fog végződni.";
		const auxiliaries = [ "fog" ];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "végződni" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "ődni at the end" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Az ügy rosszul fog végződni." );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fog" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "hu" );
	} );
} );
