var getParticiples = require( "../../../src/researches/passiveVoice/periphrastic/getParticiples.js" );
var sentencePart = require( "../../../src/values/SentencePart.js" );

describe( "Test for matching English participles", function() {
	it( "returns matched regular participles.", function() {
		var mockSentence = new sentencePart( "He was fired.", [ "was" ], "en" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "en" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "fired" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "He was fired." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "was" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "en" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns matched irregular participles.", function() {
		var mockSentence = new sentencePart( "The show was broadcast at a new channel.", [ "was" ], "en" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "en" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "broadcast" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "The show was broadcast at a new channel." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "was" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "en" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		var mockSentence = new sentencePart( "Yahoo prüfte seitdem den Sachverhalt.", [], "en" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "en" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
