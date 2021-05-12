import SentencePart from "../../../../../src/languageProcessing/languages/fr/values/SentencePart.js";

describe( "creates a French sentence part", function() {
	it( "makes sure the French sentence part inherits all functions", function() {
		const mockSentencePart = new SentencePart( "Les textes français sont magnifiques.", [ "sont" ] );
		expect( mockSentencePart.getSentencePartText() ).toBe( "Les textes français sont magnifiques." );
		expect( mockSentencePart.getAuxiliaries() ).toEqual( [ "sont" ] );
	} );

	it( "returns a irregular participle for a French sentence part", function() {
		const mockSentencePart = new SentencePart( "Le texte fut lu.", [ "fut" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "lu" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a irregular participle with a suffix for a French sentence part", function() {
		const mockSentencePart = new SentencePart( "La voiture fut vendue.", [ "fut" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "vendue" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a irregular participle with irregular conjugation pattern for a French sentence part", function() {
		const mockSentencePart = new SentencePart( "Il était mû par un désir puissant.", [ "fut" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "mû" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "irregular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a regular participle for a French sentence part", function() {
		const mockSentencePart = new SentencePart( "Le texte fut corrigé.", [ "fut" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "corrigé" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "returns a regular participle with a suffix for a French sentence part", function() {
		const mockSentencePart = new SentencePart( "Le textes fussent corrigés.", [ "fussent" ] );
		expect( mockSentencePart.getParticiples()[ 0 ].getParticiple() ).toBe( "corrigés" );
		expect( mockSentencePart.getParticiples()[ 0 ].getType() ).toBe( "regular" );
		expect( mockSentencePart.getParticiples()[ 0 ].determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
