import ItalianSentencePart from "../../../../../src/languageProcessing/languages/it/values/SentencePart.js";

describe( "creates an Italian sentence part", function() {
	it( "makes sure the Italian sentence part inherits all functions", function() {
		const mockPart = new ItalianSentencePart( "I testi italiani sono stati bellissimi.", [ "stati" ] );
		expect( mockPart.getSentencePartText() ).toBe( "I testi italiani sono stati bellissimi." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "stati" ] );
	} );

	it( "returns a participle for an Italian sentence part", function() {
		const mockPart = new ItalianSentencePart( "Il testo è stato corretto.", [ "stato" ] );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "corretto" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
