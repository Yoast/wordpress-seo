var getParticiples = require( "../../../js/researches/passiveVoice/periphrastic/getParticiples.js" );
var sentencePart = require( "../../../js/values/SentencePart.js" );

describe( "Test for matching Italian participles", function() {
	it( "returns matched irregular participles.", function() {
		var mockSentence = new sentencePart( "sono salvati dal bagnino.", [ "sono" ], "it" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "it" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "salvati" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "sono salvati dal bagnino." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "sono" ] );
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
