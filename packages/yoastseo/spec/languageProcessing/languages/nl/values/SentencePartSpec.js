import DutchSentencePart from "../../../../../src/languageProcessing/languages/nl/values/SentencePart.js";

describe( "creates a Dutch sentence part", function() {
	it( "makes sure the Dutch sentence part inherits all functions", function() {
		const mockSentencePart = new DutchSentencePart( "Deze tekst wordt geweldig.", [ "wordt" ] );
		expect( mockSentencePart.getSentencePartText() ).toBe( "Deze tekst wordt geweldig." );
		expect( mockSentencePart.getAuxiliaries() ).toEqual( [ "wordt" ] );
	} );

	it( "returns a regular participle for a Dutch sentence part", function() {
		const mockSentencePart = new DutchSentencePart( "De zin wordt ontleed.", [ "wordt" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "ontleed" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns an irregular participle for a Dutch sentence part", function() {
		const mockSentencePart = new DutchSentencePart( "Deze tekst wordt gelezen.", [ "wordt" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "gelezen" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
