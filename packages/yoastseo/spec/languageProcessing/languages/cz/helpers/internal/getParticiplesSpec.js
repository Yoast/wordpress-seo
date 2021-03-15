import getParticiples from "../../../../../../src/languageProcessing/languages/cz/helpers/internal/getParticiples.js";
import SentencePart from "../../../../../../src/values/SentencePart.js";

describe( "Test for matching Czech participles", function() {
	it( "returns matched participles.", function() {
		const mockSentence = new SentencePart( "budou propuštěni.", [ "budou" ] );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples[ 0 ].getParticiple() ).toEqual( "propuštěni" );
		expect( foundParticiples[ 0 ].getSentencePart() ).toEqual( "budou propuštěni." );
		expect( foundParticiples[ 0 ].getAuxiliaries() ).toEqual( [ "budou" ] );
		expect( foundParticiples[ 0 ].getLanguage() ).toEqual( "cs" );
		expect( foundParticiples[ 0 ].determinesSentencePartIsPassive() ).toEqual( true );
	} );

	it( "returns an empty array when there is no participle", function() {
		const mockSentence = new SentencePart( "Vstoupila do místnosti.", [] );
		const sentencePartText = mockSentence.getSentencePartText();
		const auxiliaries = mockSentence.getAuxiliaries();
		const foundParticiples = getParticiples( sentencePartText, auxiliaries );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
