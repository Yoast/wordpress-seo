import getParticiples from "../../../src/researches/passiveVoice/periphrastic/getParticiples.js";
import SentencePart from "../../../src/values/SentencePart.js";

describe( "Test for matching Portuguese participles", function() {
	it( "returns matched irregular participles.", function() {
		const mockSentence = new SentencePart( "sido acendida con o botão.", [ "sido" ], "pt" );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries, "pt" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "acendida" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "sido acendida con o botão." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "sido" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "pt" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const mockSentence = new SentencePart( "Eu como uma maçã.", [], "pt" );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries, "pt" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
