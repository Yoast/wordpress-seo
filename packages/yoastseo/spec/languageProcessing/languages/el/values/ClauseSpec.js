import GreekClause from "../../../../../src/languageProcessing/languages/el/values/Clause";

describe( "A test for creating a Greek clause object and for checking Greek participles", function() {
	it( "makes sure the Greek clause inherits all functions", function() {
		const mockClause = new GreekClause( "Ελληνικό κείμενο.", [] );
		expect( mockClause.getClauseText() ).toBe( "Ελληνικό κείμενο." );
	} );

	it( "returns passive voice for a periphrastic passive construction with an auxiliary 'to be' and a passive participle", function() {
		const mockClause = new GreekClause( "Το φαγητο είναι μαγειρεμένο από την μαμά μου.", [ "είναι" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "returns active voice if no participle is found", function() {
		const mockClause = new GreekClause( "Η γάτα μου είναι η πιο όμορφη.", [ "είναι" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
