import HungarianSentencePart from "../../../../src/researches/hungarian/passiveVoice/SentencePart.js";

	describe( "creates a hungarian sentence part", function() {
		it( "makes sure the hungarian sentence part inherits all functions", function() {
			const mockPart = new HungarianSentencePart( "Hungarian text." );
			expect( mockPart.getSentencePartText() ).toBe( "Hungarian text." );
		} );

	describe( "gets morphological participles of hungarian sentence", function() {
		it( "returns morphological participles", function() {
			const mockPart = new HungarianSentencePart( "Minden játékosnak 3 játék garantálódik", "hu");
			const foundParticiples = mockPart.getParticiples()[ 0 ];
			expect( foundParticiples.getParticiple() ).toEqual( "garantálódik" );
		} );
	} )

	describe( "gets periprhastic participles of hungarian sentence", function() {
		it( "returns periprhastic participles", function() {
			const mockPart = new HungarianSentencePart( "Ki van plakátolva a képe", [ "van" ], "hu" );
			const foundParticiples = mockPart.getParticiples()[ 0 ];
			expect( foundParticiples.getParticiple() ).toEqual( "plakátolva" );
			} );
	} )

	describe( "gets periprhastic participles of hungarian sentence", function() {
		it( "returns periprhastic participles", function() {
			const mockPart = new HungarianSentencePart( "Ki finanszírozásra kerül a képe", [ "kerül" ], "hu" );
			const foundParticiples = mockPart.getParticiples()[ 0 ];
			expect( foundParticiples.getParticiple() ).toEqual( "finanszírozásra" );
		} );
	} )

} )
