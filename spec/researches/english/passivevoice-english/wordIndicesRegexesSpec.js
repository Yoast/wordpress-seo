var wordIndicesRegexes = require( "../../../../js/researches/english/passivevoice-english/wordIndicesRegexes.js" )();

describe( "a test for matching determiners.", function() {
	it( "matches a single determiner in a sentence part", function() {
		determiners = wordIndicesRegexes.determiners( "A boy." );
		expect( determiners ).toEqual(
			[
				{ match: 'A ', index: 0 }
			]
		)
	} );

	it( "matches multiple determiners in a sentence part", function() {
		determiners = wordIndicesRegexes.determiners( "The boy, the girl, a dog." );
		expect( determiners ).toEqual(
			[
				{ match: 'The ', index: 0 },
				{ match: ' the ', index: 8 },
				{ match: ' a ', index: 18 }
			]
		);
	} );

	it( "does not match anything in a sentence part without determiners", function() {
		determiners = wordIndicesRegexes.determiners( "was chosen." );
		expect( determiners ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		determiners = wordIndicesRegexes.determiners( "" );
		expect( determiners ).toEqual( [] );
	} );
} );

describe( "a test for matching 'having'.", function() {
	it( "matches a single instance of 'having' in a sentence part", function() {
		determiners = wordIndicesRegexes.having( "was having the house painted" );
		expect( determiners ).toEqual(
			[
				{ match: ' having ', index: 3 }
			]
		)
	} );

	it( "matches multiple instances of 'having' in a sentence part", function() {
		determiners = wordIndicesRegexes.having( "having fun, having the house painted" );
		expect( determiners ).toEqual(
			[
				{ match: 'having ', index: 0 },
				{ match: ' having ', index: 11 },
			]
		);
	} );

	it( "does not match anything in a sentence part without 'having'", function() {
		determiners = wordIndicesRegexes.having( "was chosen." );
		expect( determiners ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		determiners = wordIndicesRegexes.having( "" );
		expect( determiners ).toEqual( [] );
	} );
} );
