import getClauses from "../../../../../src/languageProcessing/languages/es/helpers/getClauses.js";

describe( "splits Spanish sentences into clauses", function() {
	it( "returns all clauses from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ellos eran tres amigos cuando eran niños.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "eran tres amigos" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "eran niños." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );

	it( "returns all clauses from the auxiliary to the stopword", function() {
		const sentence = "Ellos eran tres amigos cuando los conocí.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "eran tres amigos" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "splits Spanish sentence with a sentence breaker within a word", function() {
		// Sentence breaker: 'es' in 'responsable' and 'acciones'.
		const sentence = "De aquí en adelante ella es responsable de sus acciones.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "es responsable de sus acciones." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "splits Spanish sentence with a stop character followed by a space/punctuation mark", function() {
		const sentence = "Esto es especialmente y principalmente una cuestión de dinero, resumió el primer ministro holandés, Mark Rutte.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "es especialmente y principalmente una cuestión de dinero" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "splits Spanish sentence with a stop character that is not followed by a space/punctuation mark", function() {
		const sentence = "Afortunadamente será Navidad en 2,5 semanas.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "será Navidad en 2,5 semanas." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't return clauses when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: el.
		const sentence = "Es el capítulo preferido de varios miembros del equipo de producción.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );
} );
