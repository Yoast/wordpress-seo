import FrenchClause from "../../../../../src/languageProcessing/languages/fr/values/Clause.js";

describe( "creates a French clause", function() {
	it( "makes sure the French clause inherits all functions", function() {
		const mockClause = new FrenchClause( "Les textes français sont magnifiques.", [ "sont" ] );
		expect( mockClause.getClauseText() ).toBe( "Les textes français sont magnifiques." );
		expect( mockClause.getAuxiliaries() ).toEqual( [ "sont" ] );
	} );

	it( "returns a irregular participle for a French clause", function() {
		const mockClause = new FrenchClause( "Le texte fut lu.", [ "fut" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "lu" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "returns a irregular participle with a suffix for a French clause", function() {
		const mockClause = new FrenchClause( "La voiture fut vendue.", [ "fut" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "vendue" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "returns a irregular participle with irregular conjugation pattern for a French clause", function() {
		const mockClause = new FrenchClause( "Il était mû par un désir puissant.", [ "fut" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "mû" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "returns a regular participle for a French clause", function() {
		const mockClause = new FrenchClause( "Le texte fut corrigé.", [ "fut" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "corrigé" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "returns a regular participle with a suffix for a French clause", function() {
		const mockClause = new FrenchClause( "Le textes fussent corrigés.", [ "fussent" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "corrigés" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found (direct precedence exception)", function() {
		const mockClause = new FrenchClause( "C'est en vue.", [ "c'est" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "vue" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found (precedence exception)", function() {
		const mockClause = new FrenchClause( "Ce n'est pas possible de l'avoir déjà vu.", [ "n'est" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "vu" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found (participle starting with 'l'')", function() {
		const mockClause = new FrenchClause( "Je suis sûr de l'applicabilité", [ "suis" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "l'applicabilité" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found ('other' exception list)", function() {
		const mockClause = new FrenchClause( "Elle était triste malgré tout.", [ "était" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "malgré" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found" +
		" (adjective and verb exception list)", function() {
		const mockClause = new FrenchClause( "Il est le frère aîné.", [ "est" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "aîné" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found" +
		" (adjective and verb exception list + -e suffix)", function() {
		const mockClause = new FrenchClause( "Elle est la sœur aînée.", [ "est" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "aînée" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found" +
		" (adjective and verb exception list + -es suffix)", function() {
		const mockClause = new FrenchClause( "Elles sont les sœurs aînées.", [ "sont" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "aînées" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found (noun exception list)", function() {
		const mockClause = new FrenchClause( "J’étais au café.", [ "j'étais" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "café" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found (noun exception list + suffix)", function() {
		const mockClause = new FrenchClause( "J’étais aux cafés.", [ "j'étais" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "cafés" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
