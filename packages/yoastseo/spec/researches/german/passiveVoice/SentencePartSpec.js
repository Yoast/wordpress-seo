import GermanSentencePart from "../../../../src/languages/legacy/researches/german/passiveVoice/SentencePart.js";

describe( "creates a de sentence part", function() {
	it( "makes sure the de sentence part inherits all functions", function() {
		var mockPart = new GermanSentencePart( "German text." );
		expect( mockPart.getSentencePartText() ).toBe( "German text." );
	} );
} );

describe( "gets participles of de sentence", function() {
	it( "returns participles", function() {
		var mockPart = new GermanSentencePart( "Es wurde gekauft", [ "wurde" ] );
		var foundParticiples = mockPart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "gekauft" );
	} );
} );
