import ItalianClause from "../../../../../src/languageProcessing/languages/it/values/Clause.js";

describe( "A test for checking the Italian participle", function() {
	it( "checks the properties of the Italian participle object with a passive", function() {
		const mockParticiple = new ItalianClause( "Il libro è stato scritto dal mio amico.", [ "è stato" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "scritto" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );
	
	it( "checks the properties of the Italian participle object with a direct precedence exception", function() {
		// Direct precedence exception word: il.
		const mockParticiple = new ItalianClause(  "Dovresti andare a vedere se esiste il mandato.", [ "andare" ]  );
		expect( mockParticiple.getParticiples() ).toEqual( [ "mandato" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		const mockParticiple = new ItalianClause( "Il testo è stato scritto dal mio amico.", [ "è stato" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "scritto" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );
} );
