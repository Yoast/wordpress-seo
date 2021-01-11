import getParticiples from "../../../../../../src/languageProcessing/languages/es/helpers/internal/getParticiples.js";
import SentencePart from "../../../../../../src/values/SentencePart.js";

describe( "Test for matching Spanish participles", function() {
	it( "returns matched irregular participles.", function() {
		const mockSentence = new SentencePart( "fueron agasajados con un lunch.", [ "fueron" ] );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "agasajados" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "fueron agasajados con un lunch." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "fueron" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "es" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const mockSentence = new SentencePart( "Yo como una manzana.", [] );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
