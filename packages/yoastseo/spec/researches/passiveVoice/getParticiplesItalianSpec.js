import getParticiples from "../../../src/researches/passiveVoice/periphrastic/getParticiples.js";
import sentencePart from "../../../src/values/SentencePart.js";

describe( "Test for matching Italian participles", function() {
	it( "returns matched irregular participles.", function() {
		var mockSentence = new sentencePart( "Venivano salvati dal bagnino.", [ "venivano" ], "it" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "it" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "salvati" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Venivano salvati dal bagnino." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "venivano" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		var mockSentence = new sentencePart( "Sto mangiando una mela.", [], "it" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "it" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
