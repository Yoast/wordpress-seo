import SentencePart from "../../../../../src/languageProcessing/languages/pt/values/SentencePart.js";

describe( "creates a Portuguese sentence part", function() {
	it( "makes sure the Portuguese sentence part inherits all functions", function() {
		const mockSentencePart = new SentencePart( "Os gatos tortie são especiais.", [ "são" ] );
		expect( mockSentencePart.getSentencePartText() ).toBe( "Os gatos tortie são especiais." );
		expect( mockSentencePart.getAuxiliaries() ).toEqual( [ "são" ] );
	} );

	it( "returns an irregular participle for a Portuguese sentence part", function() {
		const mockSentencePart = new SentencePart( "A decisão fora aprovado por mim.", [ "fora" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "aprovado" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
