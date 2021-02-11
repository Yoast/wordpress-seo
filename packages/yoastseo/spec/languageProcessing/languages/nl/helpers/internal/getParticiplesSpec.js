import getParticiples from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/getParticiples";

describe( "Test for matching Dutch participles", function() {
	it( "returns matched regular participles.", function() {
		let sentence = "De kat werd geadopteerd door de aardige mensen.";
		let auxiliaries = [ "werd" ];
		let foundParticiples = getParticiples( sentence, auxiliaries, );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "geadopteerd" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "De kat werd geadopteerd door de aardige mensen." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );

		sentence = "De boeken werden teruggegeven.";
		auxiliaries = [ "werden" ];
		foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "teruggegeven" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "De boeken werden teruggegeven." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles.", function() {
		let sentence = "De snacks werden door de kat gegeten.";
		let auxiliaries = [ "werden" ];
		let foundParticiples = getParticiples( sentence, auxiliaries, );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "gegeten" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "De snacks werden door de kat gegeten." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );

		sentence = "De draden werden aaneengedraaid.";
		auxiliaries = [ "werden" ];
		foundParticiples = getParticiples( sentence, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "aaneengedraaid" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "De draden werden aaneengedraaid." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle or the sentence is empty", function() {
		const sentence = "De kat is erg blij in haar nieuwe huis.";
		const auxiliaries = [ "werd", "werden" ];
		expect( getParticiples( sentence, auxiliaries ) ).toEqual( [] );
		expect( getParticiples( "", auxiliaries ) ).toEqual( [] );
	} );
} );
