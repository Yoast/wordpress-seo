import GermanSentencePart from "../../../../../src/languageProcessing/languages/de/values/SentencePart.js";

describe( "creates a German sentence part", function() {
	it( "makes sure the German sentence part inherits all functions", function() {
		const mockSentencePart = new GermanSentencePart( "German text.", [] );
		expect( mockSentencePart.getSentencePartText() ).toBe( "German text." );
	} );
} );

describe( "gets participles of a German sentence", function() {
	it( "returns participles", function() {
		const mockSentencePart = new GermanSentencePart( "Es wurde gekauft", [ "wurde" ] );
		const foundParticiples = mockSentencePart.getParticiples()[ 0 ];
		expect( foundParticiples.getParticiple() ).toEqual( "gekauft" );
	} );
} );
