var getParticiples = require("../../../js/researches/passivevoice/getParticiples.js");
var sentencePart = require ( "../../../js/values/SentencePart.js");

describe("Test for matching French participles", function(){
	it("returns matched regular participles.", function(){
		var mockSentence = new sentencePart( "Elle fut remarquée par un agent de théâtre.", [ "fut" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "remarquée" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Elle fut remarquée par un agent de théâtre." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched regular participles and filtered exceptions; exceptions don't set the sentence part passive.", function(){
		var mockSentence = new sentencePart( "Elle a été remarquée par un agent de théâtre.", [ "été" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "été" );
		expect( foundParticiples[ 1 ].getParticiple() ).toEqual( "remarquée" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 1 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Elle a été remarquée par un agent de théâtre." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "été" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( false );
		expect( foundParticiples[ 1 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched irregular participles.", function(){
		var mockSentence = new sentencePart( "Cela fut dit sans malice.", [ "fut" ], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "dit" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Cela fut dit sans malice." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns an empty array when there is no participle", function(){
		var mockSentence = new sentencePart( " Je voulais vous demander pardon.", [], "fr" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "fr" );
		expect( foundParticiples ).toEqual( [] );
	});
});