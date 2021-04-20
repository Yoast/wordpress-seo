import getClauses from "../../../../../src/languageProcessing/languages/fr/helpers/getClauses.js";

describe( "splits French sentences into clauses", function() {
	it( "returns all clauses from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ils étaient très amis lorsqu'ils étaient enfants.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "étaient très amis" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "étaient enfants." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );

	it( "returns all clauses from the auxiliary to the stopword", function() {
		const sentence = "Ils étaient très heureux lorsque je les y conduisais.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "étaient très heureux" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentences on a sentence breaker if it's within a word", function() {
		// Sentence breaker: 'es' in 'responsable', 'tes' and 'actes'.
		const sentence = "Désormais tu es responsable de tes actes.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "es responsable de tes actes." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "returns clauses when there is a stop character followed by a space/punctuation mark", function() {
		// Stop character: ,
		const sentence = "Cela est en particulier une question d'argent, a résumé le Premier ministre néerlandais Mark Rutte.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "est en particulier une question d'argent" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentences on a stop character that is not followed by a space/punctuation mark", function() {
		// Stop character: ,
		const sentence = "La branche était déficitaire de 1,5 milliard.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "était déficitaire de 1,5 milliard." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't return clauses when an auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Ils se sont lavés.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );

	it( "doesn't return clauses when an auxiliary is preceded by an elided reflexive pronoun (s')", function() {
		const sentence = "L’emballement s'est prolongé mardi 9 janvier.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );

	it( "doesn't return a clauses when there is a non-auxiliary sentence breaker (comma) but the auxiliary is preceded" +
		" by a reflexive pronoun", function() {
		const sentence = "Nous sommes arrivés, nous nous sommes lavés, et puis nous nous sommes couchés.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "sommes arrivés" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't return clauses when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: le.
		const sentence = "C'est le film le plus vu.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );
} );
