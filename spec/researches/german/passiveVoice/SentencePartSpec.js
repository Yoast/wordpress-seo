var GermanSentencePart = require( "../../../../js/researches/german/passiveVoice/SentencePart.js" );

describe( "creates a german sentence part", function() {
	it( "makes sure the german sentence part inherits all functions", function() {
		var mockPart = new GermanSentencePart( "German text." );
		expect( mockPart.getSentencePartText() ).toBe( "German text." );
	} );
} );

describe( "gets participles of german sentence", function() {
	it( "returns participles", function() {
		var mockPart = new GermanSentencePart( "Es wurde gekauft", [ "wurde" ] );
		var foundParticiples = mockPart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "gekauft" );
	} );
} );
