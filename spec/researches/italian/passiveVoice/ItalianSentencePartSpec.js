var ItalianSentencePart = require( "../../../../js/researches/italian/passiveVoice/SentencePart.js" );

describe( "creates an Italian sentence part", function() {
	it( "makes sure the Italian sentence part inherits all functions", function() {
		var mockPart = new ItalianSentencePart( "I testi italiani sono bellissimi.", [ "sono" ], "it_IT" );
		expect( mockPart.getSentencePartText() ).toBe( "I testi italiani sono bellissimi." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "sono" ] );
		expect( mockPart.getLocale() ).toBe( "it_IT" );
	} );

	it( "returns a participle for an Italian sentence part", function() {
		var mockPart = new ItalianSentencePart( "Il testo è stato corretto.", [ "è" ], "it_IT" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "corretto" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
