import getClauses from "../../../../../src/languageProcessing/languages/pt/helpers/getClauses.js";

describe( "splits Portuguese sentences into clauses", function() {
	it( "returns all clauses from the auxiliary to the stopword and from the stopword to the end of the sentence, " +
		"and returns their passiveness", function() {
		const sentence = "Eles eram três amigos quando eram crianças.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "eram três amigos quando" );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "eram crianças." );
		expect( getClauses( sentence )[ 1 ].isPassive() ).toBe( false );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );

	it( "returns all clauses from the auxiliary to the stopword and returns their passiveness", function() {
		const sentence = "Eles eram três amigos quando os conheci.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "eram três amigos" );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentences on a sentence breaker if it's within a word", function() {
		// Sentence breaker: 'e' in 'internet' and 'energia'.
		const sentence = "A internet do conhecimento é combinada com a internet da energia e a internet da mobilidade.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "é combinada com a internet da energia" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "returns clauses when there is a stop character followed by a space/punctuation mark and returns their passiveness", function() {
		const sentence = "Isso é especialmente uma questão de dinheiro, resumiu o primeiro-ministro holandês, Mark Rutte.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "é especialmente uma questão de dinheiro" );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentences on a stop character that is not followed by a space/punctuation mark", function() {
		const sentence = "Felizmente será Natal em 2,5 semanas.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "será Natal em 2,5 semanas." );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't return clauses when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: o.
		const sentence = "É o capítulo preferido de vários membros da equipe de produção.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );
} );
