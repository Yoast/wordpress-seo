var getParticiples = require("../../../../js/researches/french/passivevoice/getParticiples.js");
var sentencePart = require ( "../../../../js/values/SentencePart.js");

describe("Test for matching French participles", function(){
	it("returns matched regular participles.", function(){
		var mockSentence = new sentencePart( "Elle fut remarquée par un agent de théâtre.", [ "fut" ] );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "remarquée" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "regular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Elle fut remarquée par un agent de théâtre." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns matched irregular participles.", function(){
		var mockSentence = new sentencePart( "Cela fut dit sans malice.", [ "fut" ] );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "dit" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "Cela fut dit sans malice." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fut" ] );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	});

	it("returns an empty array when there is no participle", function(){
		var mockSentence = new sentencePart( " Je voulais vous demander pardon.", [] );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	});
});