import PolishSentencePart from "../../../../../src/languageProcessing/languages/pl/values/SentencePart.js";

describe( "creates a Polish sentence part", function() {
	it( "makes sure the Polish sentence part inherits all functions", function() {
		const mockPart = new PolishSentencePart( "To jest piękne zdanie.", [ "jest" ] );
		expect( mockPart.getSentencePartText() ).toBe( "To jest piękne zdanie." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "jest" ] );
	} );

	it( "returns a participle for a Polish sentence part", function() {
		const mockPart = new PolishSentencePart( "To zdanie jest pisane przeze mnie.", [ "jest" ] );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "pisane" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
