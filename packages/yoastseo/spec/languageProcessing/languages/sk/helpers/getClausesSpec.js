import getClauses from "../../../../../src/languageProcessing/languages/sk/helpers/getClauses.js";

describe( "splits Slovak sentences into clauses", function() {
	xit( "returns the whole sentence when there is no stopword", function() {
		const sentence = "On bol odporúčaný k lekárovi.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "On bol odporúčaný k lekárovi." );
		expect( getClauses( sentence )[ 0 ].getParticiples() ).toEqual( [ "odporúčaný" ] );
		expect( getClauses( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "bol" ] );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	xit( "returns all clauses from the sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "bola mačka adoptované alebo bola kúpená?";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "bola mačka adoptované" );
		expect( getClauses( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "bola" ] );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "alebo bola kúpená?" );
		expect( getClauses( sentence )[ 1 ].getAuxiliaries() ).toEqual( [ "bola" ] );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
	it( "splits sentence on stop character", function() {
		const sentence = "Jedlo je hotové, stôl je vyčistený.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Jedlo je hotové" );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "stôl je vyčistený." );
		expect( getClauses( sentence )[ 1 ].isPassive() ).toBe( true );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
} );
