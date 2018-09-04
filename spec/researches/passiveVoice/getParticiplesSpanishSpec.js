import getParticiples from '../../../src/researches/passiveVoice/periphrastic/getParticiples.js';
import sentencePart from '../../../src/values/SentencePart.js';

describe( "Test for matching Spanish participles", function() {
	it( "returns matched irregular participles.", function() {
		var mockSentence = new sentencePart( "fueron agasajados con un lunch.", [ "fueron" ], "es" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "es" );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "agasajados" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "fueron agasajados con un lunch." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fueron" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "es" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		var mockSentence = new sentencePart( "Yo como una manzana.", [], "es" );
		var sentencePartText = mockSentence.getSentencePartText();
		var auxiliaries = mockSentence.getAuxiliaries();
		var foundParticiples = getParticiples( sentencePartText, auxiliaries, "es" );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
