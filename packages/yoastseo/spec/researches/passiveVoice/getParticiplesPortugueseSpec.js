import getParticiples from "../../../src/researches/passiveVoice/periphrastic/getParticiples.js";
import sentencePart from "../../../src/values/SentencePart.js";

describe( "Test for matching Portuguese participles", function() {
	it( "returns matched irregular participles.", function() {
		var mockSentence = new sentencePart( "sido acendida con o botão.", [ "sido" ], "pt" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "pt" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "acendida" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "sido acendida con o botão." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "sido" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "pt" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		var mockSentence = new sentencePart( "Eu como uma maçã.", [], "pt" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "pt" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
