import getParticiples from '../../../src/researches/passiveVoice/periphrastic/getParticiples.js';
import sentencePart from '../../../src/values/SentencePart.js';

describe( "Test for matching French participles", function() {
	it( "returns matched regular participles.", function() {
		var mockSentence = new sentencePart( "fut remarquée par un agent de théâtre.", [ "fut" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "remarquée" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "fut remarquée par un agent de théâtre." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched regular participles in question sentences with inverted auxiliaries.", function() {
		var mockSentence = new sentencePart( "était-il informé de cela ?", [ "était-il" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "informé" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "était-il informé de cela ?" );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "était-il" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched regular participles and filtered exceptions; exceptions don't mark the sentence part as passive.", function() {
		var mockSentence = new sentencePart( "été remarquée par un agent de théâtre.", [ "été" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
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
		var mockSentence = new sentencePart( "fut dit sans malice.", [ "fut" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "dit" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "fut dit sans malice." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles with irregular conjugation pattern.", function() {
		var mockSentence = new sentencePart( "était mû par un désir puissant.", [ "était" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "mû" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "était mû par un désir puissant." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "était" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "fr" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles ending in -s.", function() {
		var mockSentence = new sentencePart( "été promise à maintes reprises.", [ "été" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
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
		var mockSentence = new sentencePart( "Je voulais vous demander pardon.", [], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
