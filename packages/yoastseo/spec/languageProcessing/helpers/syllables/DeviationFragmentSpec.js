import DeviationFragment from "../../../../src/languageProcessing/helpers/syllables/DeviationFragment";

describe( "DeviationFragment", function() {
	describe( "getRegex", function() {
		it( "should create a simple global regex", function() {
			const deviationFragment = new DeviationFragment( {
				word: "fragment",
			} );

			expect( deviationFragment.getRegex() ).toEqual( /fragment/ );
		} );

		it( "should create a regex for at the start of a word", function() {
			const deviationFragment = new DeviationFragment( {
				location: "atBeginning",
				word: "fragment",
			} );
			const expected = /^fragment/;

			const result = deviationFragment.getRegex();

			expect( result ).toEqual( expected );
		} );

		it( "should create a regex for at the end of a word", function() {
			const deviationFragment = new DeviationFragment( {
				location: "atEnd",
				word: "fragment",
			} );
			const expected = /fragment$/;

			const result = deviationFragment.getRegex();

			expect( result ).toEqual( expected );
		} );

		it( "should create a regex for at the end of a word", function() {
			const deviationFragment = new DeviationFragment( {
				location: "atBeginningOrEnd",
				word: "fragment",
			} );
			const expected = /(^fragment)|(fragment$)/;

			const result = deviationFragment.getRegex();

			expect( result ).toEqual( expected );
		} );

		it( "supports notFollowedBy", function() {
			const deviationFragment = new DeviationFragment( {
				word: "fragment",
				notFollowedBy: [ "a", "s" ],
			} );
			const expected = /fragment(?![as])/;

			const result = deviationFragment.getRegex();

			expect( result ).toEqual( expected );
		} );

		it( "supports alsoFollowedBy", function() {
			const deviationFragment = new DeviationFragment( {
				word: "fragment",
				alsoFollowedBy: [ "a", "s" ],
			} );
			const expected = /fragment[as]?/;

			const result = deviationFragment.getRegex();

			expect( result ).toEqual( expected );
		} );
	} );

	describe( "occursIn", function() {
		it( "should match it's fragment with the given word", function() {
			const deviationFragment = new DeviationFragment( {
				word: "fragment",
			} );

			expect( deviationFragment.occursIn( "fragment" ) ).toBe( true );
			expect( deviationFragment.occursIn( "hello" ) ).toBe( false );
			expect( deviationFragment.occursIn( "beforefragmentafter" ) ).toBe( true );
		} );
	} );

	describe( "removeFrom", function() {
		it( "removes the fragment from the given word", function() {
			const deviationFragment = new DeviationFragment( {
				word: "fragment",
			} );

			expect( deviationFragment.removeFrom( "fragment" ) ).toBe( " " );
			expect( deviationFragment.removeFrom( "beforefragmentafter" ) ).toBe( "before after" );
			expect( deviationFragment.removeFrom( "beforefragment" ) ).toBe( "before " );
			expect( deviationFragment.removeFrom( "fragmentafter" ) ).toBe( " after" );
		} );
	} );

	describe( "getSyllables", function() {
		it( "returns the syllables for this fragment", function() {
			const deviationFragment = new DeviationFragment( {
				syllables: 5,
			} );

			expect( deviationFragment.getSyllables() ).toBe( 5 );
		} );
	} );
} );
