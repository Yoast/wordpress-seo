import getParticiples from "../../../../../../src/languageProcessing/languages/fr/helpers/internal/getParticiples";

describe( "Test for matching French participles", function() {
	it( "returns matched regular participles.", function() {
		const sentencePartText = "fut remarquée par un agent de théâtre.";
		const auxiliaries = [ "fut" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "remarquée" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "fut remarquée par un agent de théâtre." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched regular participles in question sentences with inverted auxiliaries.", function() {
		const sentencePartText = "était-il informé de cela ?";
		const auxiliaries = [ "était-il" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "informé" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "était-il informé de cela ?" );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "était-il" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched regular participles and filtered exceptions; exceptions don't mark the sentence part as passive.", function() {
		const sentencePartText = "été remarquée par un agent de théâtre.";
		const auxiliaries = [ "été" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "été" );
		expect( foundParticiples[ 1 ].getParticiple() ).toEqual( "remarquée" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 1 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "été remarquée par un agent de théâtre." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "été" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 1 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( false );
		expect( foundParticiples[ 1 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles.", function() {
		const sentencePartText = "fut dit sans malice.";
		const auxiliaries = [ "fut" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "dit" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "fut dit sans malice." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles with irregular conjugation pattern.", function() {
		const sentencePartText = "était mû par un désir puissant.";
		const auxiliaries = [ "était" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "mû" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "était mû par un désir puissant." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "était" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles ending in -s.", function() {
		const sentencePartText = "été promise à maintes reprises.";
		const auxiliaries = [ "été" ];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "été" );
		expect( foundParticiples[ 1 ].getParticiple() ).toEqual( "promise" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 1 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "été promise à maintes reprises." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "été" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 1 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( false );
		expect( foundParticiples[ 1 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const sentencePartText = "Je voulais vous demander pardon.";
		const auxiliaries = [];
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
