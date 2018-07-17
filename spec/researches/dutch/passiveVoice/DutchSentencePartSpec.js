import DutchSentencePart from "../../../../js/researches/dutch/passiveVoice/SentencePart.js";

describe( "creates a French sentence part", function() {
	it( "makes sure the French sentence part inherits all functions", function() {
		const mockSentencePart = new DutchSentencePart( "Deze tekst wordt geweldig.", [ "wordt" ], "nl_NL" );
		expect( mockSentencePart.getSentencePartText() ).toBe( "Deze tekst wordt geweldig." );
		expect( mockSentencePart.getAuxiliaries() ).toEqual( [ "wordt" ] );
		expect( mockSentencePart.getLocale() ).toBe( "nl_NL" );
	} );

	it( "returns a regular participle for a French sentence part", function() {
		const mockSentencePart = new DutchSentencePart( "De zin wordt ontleed.", [ "wordt" ], "nl_NL" );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "ontleed" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns an irregular participle for a French sentence part", function() {
		const mockSentencePart = new DutchSentencePart( "Deze tekst wordt gelezen.", [ "wordt" ], "nl_NL" );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "gelezen" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
