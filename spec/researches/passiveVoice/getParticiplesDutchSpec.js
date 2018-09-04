import getParticiples from '../../../src/researches/passiveVoice/periphrastic/getParticiples.js';
import SentencePart from '../../../src/values/SentencePart.js';

describe( "Test for matching Dutch participles", function() {
	it( "returns matched regular participles.", function() {
		const mockSentence = new SentencePart( "werd verkocht.", [ "werd" ], "nl" );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries, "nl" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "verkocht" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "werd verkocht." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles.", function() {
		const mockSentence = new SentencePart( "werden gescheiden.", [ "werden" ], "nl" );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries, "nl" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "gescheiden" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "werden gescheiden." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "nl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const mockSentence = new SentencePart( "Wij gaan naar huis.", [], "nl" );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries, "nl" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
