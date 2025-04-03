import Sentence from "../../../src/languageProcessing/values/Sentence.js";
import Clause from "../../../src/languageProcessing/values/Clause";

describe( "constructor", () => {
	it( "creates a new sentence instance", () => {
		const assessment = new Sentence( "Cats are angels." );
		expect( assessment._sentenceText ).toEqual( "Cats are angels." );
	} );
} );

describe( "Creates an empty sentence object", function() {
	it( "returns a sentence containing no text", function() {
		const sentence = new Sentence();
		expect( sentence.getSentenceText() ).toBe( "" );
	} );
} );

describe( "Creates a sentence object", function() {
	it( "creates a sentence containing text", function() {
		const sentence = new Sentence( "Team Lingo is happy because the research was finished." );
		expect( sentence.getSentenceText() ).toBe( "Team Lingo is happy because the research was finished." );
	} );

	it( "sets the sentence to passive when one of the clauses is passive.", function() {
		const sentence = new Sentence( "Team Lingo is happy because the research was finished." );
		const mockClause = new Clause( "because the research was finished", [ "was" ] );
		mockClause.setPassive( true );
		const clauses = [ mockClause ];

		sentence.setClauses( clauses );
		expect( sentence.getSentenceText() ).toBe( "Team Lingo is happy because the research was finished." );
		expect( sentence.getClauses() ).toEqual( clauses );
		expect( sentence.isPassive() ).toEqual( true );
	} );

	it( "sets the sentence to non-passive when there are no passive clauses.", function() {
		const sentence = new Sentence( "Team Lingo is happy because the research was easy." );
		const mockClause = new Clause( "because the research was easy", [ "was" ] );
		mockClause.setPassive( false );
		const clauses = [ mockClause ];

		sentence.setClauses( clauses );
		expect( sentence.getSentenceText() ).toBe( "Team Lingo is happy because the research was easy." );
		expect( sentence.getClauses() ).toEqual( clauses );
		expect( sentence.isPassive() ).toEqual( false );
	} );

	it( "returns a sentence object containing text and serializes and parses it.", function() {
		const sentence = new Sentence( "Cats are adored." );
		const mockClause = new Clause( "Cats are adored", [ "are" ] );
		mockClause.setPassive( true );
		const clauses = [ mockClause ];

		sentence.setClauses( clauses );
		expect( sentence.getClauses() ).toEqual( clauses );
		expect( sentence.serialize() ).toEqual( {
			_parseClass: "Sentence",
			clauses: [ {
				_auxiliaries: [ "are" ],
				_clauseText: "Cats are adored",
				_isPassive: true,
				_participles: [] },
			],
			isPassive: true,
			sentenceText: "Cats are adored.",
		} );
	} );
} );
