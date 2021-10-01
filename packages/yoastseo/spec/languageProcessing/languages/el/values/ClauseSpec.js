import GreekClause from "../../../../../src/languageProcessing/languages/el/values/Clause";

describe( "A test for creating a Greek clause object", function() {
	xit( "makes sure the Greek clause inherits all functions", function() {
		const mockClause = new GreekClause( "Greek text.", [] );
		expect( mockClause.getClauseText() ).toBe( "Greek text." );
	} );
} );

describe( "A test for checking Greek participles", function() {
	xit( "returns passive voice for a periphrastic passive construction with an auxiliary 'to be' and a passive participle", function() {
		const mockClause = new GreekClause( "Το άρθρο έχει να γραφθεί.", [ "έχει" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	xit( "returns passive voice for a periphrastic passive construction with an auxiliary 'to have' and a passive infinitive", function() {
		const mockClause = new GreekClause( "Το άρθρο έχει να γραφθεί.", [ "έχει" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	xit( "returns passive voice for a periphrastic passive construction with an auxiliary 'to have' and" +
		" a passive infinitive ending in -ηθεί", function() {
		const mockClause = new GreekClause( "Το άρθρο έχει να γραφθεί.", [ "έχει" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	xit( "returns active voice for a sentence with an auxiliary 'to have' and a passive participle", function() {
		const mockClause = new GreekClause( "Το άρθρο έχει να γραφθεί.", [ "έχει" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	xit( "returns active voice for a sentence with an auxiliary 'to have' and a active infinitive", function() {
		const mockClause = new GreekClause( "Το άρθρο έχει να γραφθεί.", [ "έχει" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "returns active voice for a sentence with an auxiliary 'to have' and a passive infinitive, " +
		"but the infinitive is directly preceded by 'να' ", function() {
		const mockClause = new GreekClause( "Το άρθρο έχει να γραφθεί.", [ "έχει" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
