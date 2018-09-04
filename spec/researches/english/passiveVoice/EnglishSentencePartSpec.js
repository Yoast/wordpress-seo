import EnglishSentencePart from '../../../../src/researches/english/passiveVoice/SentencePart.js';

describe( "creates a English sentence part", function() {
	it( "makes sure the English sentence part inherits all functions", function() {
		var mockPart = new EnglishSentencePart( "English texts are great.", [ "are" ], "en_US" );
		expect( mockPart.getSentencePartText() ).toBe( "English texts are great." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "are" ] );
		expect( mockPart.getLocale() ).toBe( "en_US" );
	} );
	it( "returns a irregular participle for an English sentence part", function() {
		var mockPart = new EnglishSentencePart( "English texts are written.", [ "are" ], "en_US" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "written" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
	it( "returns a regular participle for an English sentence part", function() {
		var mockPart = new EnglishSentencePart( "The kitchen cabinets were nailed to the wall.", [ "are" ], "en_US" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "nailed" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
