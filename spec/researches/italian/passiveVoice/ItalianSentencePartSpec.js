var ItalianSentencePart = require( "../../../../src/researches/italian/passiveVoice/SentencePart.js" );

describe( "creates an Italian sentence part", function() {
	it( "makes sure the Italian sentence part inherits all functions", function() {
		var mockPart = new ItalianSentencePart( "I testi italiani sono stati bellissimi.", [ "stati" ], "it_IT" );
		expect( mockPart.getSentencePartText() ).toBe( "I testi italiani sono stati bellissimi." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "stati" ] );
		expect( mockPart.getLocale() ).toBe( "it_IT" );
	} );

	it( "returns a participle for an Italian sentence part", function() {
		var mockPart = new ItalianSentencePart( "Il testo è stato corretto.", [ "stato" ], "it_IT" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "corretto" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
