import getParticiples from "../../../../../../src/languageProcessing/languages/pl/helpers/internal/getParticiples.js";
import SentencePart from "../../../../../../src/values/SentencePart.js";

describe( "Test for matching Polish participles", function() {
	it( "returns matched irregular participles.", function() {
		const mockSentence = new SentencePart( "zostały zakupione.", [ "zostały" ] );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "zakupione" );
		expect( foundParticiples[ 0 ].getType() ).toEqual( "irregular" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "zostały zakupione." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "zostały" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "pl" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const mockSentence = new SentencePart( "Chodźmy do sklepu.", [] );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
