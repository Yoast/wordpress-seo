import SpanishSentencePart from "../../../../../src/languageProcessing/languages/es/values/SentencePart.js";

describe( "creates a Spanish sentence part", function() {
	it( "makes sure the Spanish sentence part inherits all functions", function() {
		const mockPart = new SpanishSentencePart( "Los libros españoles son caros.", [ "son" ] );
		expect( mockPart.getSentencePartText() ).toBe( "Los libros españoles son caros." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "son" ] );
	} );

	it( "returns a irregular participle for a Spanish sentence part", function() {
		const mockPart = new SpanishSentencePart( "Este libro es leído por millones.", [ "es" ] );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "leído" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
