import SpanishSentencePart from '../../../../src/researches/spanish/passiveVoice/SentencePart.js';

describe( "creates a Spanish sentence part", function() {
	it( "makes sure the Spanish sentence part inherits all functions", function() {
		var mockPart = new SpanishSentencePart( "Los libros españoles son caros.", [ "son" ], "es_ES" );
		expect( mockPart.getSentencePartText() ).toBe( "Los libros españoles son caros." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "son" ] );
		expect( mockPart.getLocale() ).toBe( "es_ES" );
	} );

	it( "returns a irregular participle for a Spanish sentence part", function() {
		var mockPart = new SpanishSentencePart( "Este libro es leído por millones.", [ "es" ], "es_ES" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "leído" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
