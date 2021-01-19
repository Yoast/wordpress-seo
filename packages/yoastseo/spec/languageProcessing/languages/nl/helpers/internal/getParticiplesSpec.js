import getParticiples from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/getParticiples";

describe( "Test for matching Dutch participles", function() {
	it( "returns matched regular participles.", function() {
		const sentence = "De kat werd geadopteerd door de aardige mensen.";
		const auxiliaries = [ "werd" ];
		const foundParticiples = getParticiples( sentence, auxiliaries, );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "geadopteerd" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "De kat werd geadopteerd door de aardige mensen." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles.", function() {
		const sentence = "De snacks werden door de kat gegeten.";
		const auxiliaries = [ "werden" ];
		const foundParticiples = getParticiples( sentence, auxiliaries, );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "gegeten" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "De snacks werden door de kat gegeten." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const sentence = "De kat is erg blij in haar nieuwe huis.";
		const auxiliaries = [];
		const foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
