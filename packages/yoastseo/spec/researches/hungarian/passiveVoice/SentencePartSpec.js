import HungarianSentencePart from "../../../../src/researches/hungarian/passiveVoice/SentencePart.js";

describe( "creates a hungarian sentence part", function() {
	it( "makes sure the hungarian sentence part inherits all functions", function() {
		const mockPart = new HungarianSentencePart( "Hungarian text." );
		expect( mockPart.getSentencePartText() ).toBe( "Hungarian text." );
	} );
} );

describe( "gets periprhastic participles of hungarian sentence", function() {
	it( "returns periprhastic participles ending in -va", function() {
		const mockPart = new HungarianSentencePart( "Ki van plakátolva a képe", [ "van" ], "hu" );
		const foundParticiples = mockPart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "plakátolva" );
	} );
} );

describe( "gets periprhastic participles of hungarian sentence", function() {
	it( "returns periprhastic participles ending in -ve", function() {
		const mockPart = new HungarianSentencePart( "A könyv oda van téve az asztalra", [ "van" ], "hu" );
		const foundParticiples = mockPart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "téve" );
	} );
} );

describe( "gets periprhastic participles of hungarian sentence", function() {
	it( "returns periprhastic participles ending in -ra", function() {
		const mockPart = new HungarianSentencePart( "megfinanszírozásra került a projekt", [ "került" ], "hu" );
		const foundParticiples = mockPart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "megfinanszírozásra" );
	} );
} );

describe( "gets periprhastic participles of hungarian sentence", function() {
	it( "returns periprhastic participles ending in -re", function() {
		const mockPart = new HungarianSentencePart( "beszállításra került a beteg", [ "került" ], "hu" );
		const foundParticiples = mockPart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "beszállításra" );
	} );
} );
