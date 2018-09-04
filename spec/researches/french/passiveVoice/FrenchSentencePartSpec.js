var FrenchSentencePart = require( "../../../../src/researches/french/passiveVoice/SentencePart.js" );

describe( "creates a French sentence part", function() {
	it( "makes sure the French sentence part inherits all functions", function() {
		var mockPart = new FrenchSentencePart( "Les textes français sont magnifiques.", [ "sont" ], "fr_FR" );
		expect( mockPart.getSentencePartText() ).toBe( "Les textes français sont magnifiques." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "sont" ] );
		expect( mockPart.getLocale() ).toBe( "fr_FR" );
	} );

	it( "returns a irregular participle for a French sentence part", function() {
		var mockPart = new FrenchSentencePart( "Le texte fut lu.", [ "fut" ], "fr_FR" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "lu" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a irregular participle with a suffix for a French sentence part", function() {
		var mockPart = new FrenchSentencePart( "La voiture fut vendue.", [ "fut" ], "fr_FR" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "vendue" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a irregular participle with irregular conjugation pattern for a French sentence part", function() {
		var mockPart = new FrenchSentencePart( "Il était mû par un désir puissant.", [ "fut" ], "fr_FR" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "mû" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a regular participle for a French sentence part", function() {
		var mockPart = new FrenchSentencePart( "Le texte fut corrigé.", [ "fut" ], "fr_FR" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "corrigé" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a regular participle with a suffix for a French sentence part", function() {
		var mockPart = new FrenchSentencePart( "Le textes fussent corrigés.", [ "fussent" ], "fr_FR" );
		expect( mockPart.getParticiples()[ 0 ].getParticiple() ).toBe( "corrigés" );
		expect( mockPart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockPart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
