import Clause from "../../src/values/Clause.js";

describe( "creates a Clause", function() {
	const mockClause = new Clause( "The cat is loved.", [ "is" ] );
	// eslint-disable-next-line require-jsdoc

	it( "tests the constructor", () => {
		expect( mockClause._clauseText ).toEqual( "The cat is loved." );
		expect( mockClause._auxiliaries ).toEqual( [ "is" ] );
		expect( mockClause._isPassive ).toEqual( false );
		expect( mockClause._participles ).toEqual( [] );
	} );

	it( "returns the text of the clause", function() {
		expect( mockClause.getClauseText() ).toBe( "The cat is loved." );
	} );

	it( "returns the auxiliaries of the clause", function() {
		expect( mockClause.getAuxiliaries() ).toEqual( [ "is" ] );
	} );

	it( "returns whether the sentence is passive", function() {
		mockClause.setPassive( true );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "returns the participles", function() {
		mockClause.setParticiples( [ "loved" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "loved" ] );
	} );
} );

describe( "a test for checking whether clauses are passive", function() {
	const mockClausePassive = new Clause( "The cat is loved.", [ "is" ] );
	const mockClauseActive = new Clause( "My cat is tired.", [ "is" ] );

	// eslint-disable-next-line require-jsdoc
	const mockIsParticiplePassive = function( clauseText, participle ) {
		if ( participle === "tired" ) {
			return false;
		}
		return !! ( clauseText && participle.endsWith( "ed" ) );
	};

	it( "isPassive returns true after setClausePassiveness finds a passive", function() {
		mockClausePassive.setParticiples( [ "loved" ] );
		mockClausePassive.setClausePassiveness( mockIsParticiplePassive );
		expect( mockClausePassive.isPassive() ).toBe( true );
	} );

	it( "isPassive returns false after setClausePassiveness doesn't find a passive", function() {
		mockClauseActive.setParticiples( [ "tired" ] );
		mockClauseActive.setClausePassiveness( mockIsParticiplePassive );
		expect( mockClauseActive.isPassive() ).toBe( false );
	} );
} );

describe( "a test for serializing and parsing a Clause class instance", function() {
	const mockClause = new Clause( "The cat is loved.", [ "is" ] );

	it( "serializes and parses an instance of the Clause class.", function() {
		expect( mockClause.serialize() ).toEqual( {
			_parseClass: "Clause",
			clauseText: "The cat is loved.",
			auxiliaries: [ "is" ],
			isPassive: false,
			participles: [],
		} );
		expect( mockClause.parse( mockClause.serialize() ) ).toEqual( {
			_clauseText: "The cat is loved.",
			_auxiliaries: [ "is" ],
			_isPassive: false,
			_participles: [],
		} );
	} );
} );
