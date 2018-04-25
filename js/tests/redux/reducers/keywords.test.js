/* global describe, it, expect */

import { setKeywords, addKeyword, removeKeyword } from "../../../src/redux/actions/keywords";
import keywordsReducer from "../../../src/redux/reducers/keywords";

describe( "keywords reducers", () => {
	describe( "setKeywords", () => {
		it( "should replace all the current keywords with the requested ones", () => {
			const state = [ "some", "existing", "keywords", "that", "will", "be", "replaced" ];
			const action = setKeywords( [ "first", "second", "third" ] );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should ignore non-unique keywords", () => {
			const state = [];
			const action = setKeywords( [ "first", "first", "first", "second", "first", "third", "second" ] );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should ignore non-string keywords", () => {
			const state = [];
			const action = setKeywords( [ 1, "first", { 2: "two" }, "second", this, "third", true ] );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when you pass nothing", () => {
			const state = [ "first", "second", "third" ];
			const action = setKeywords();
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when you pass an unexpected variable", () => {
			const state = [ "first", "second", "third" ];
			const action = setKeywords( this );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "addKeyword", () => {
		it( "should add a keyword", () => {
			const state = [];
			const action = addKeyword( "first" );
			const expected = [ "first" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should default to adding a keyword at the end", () => {
			const state = [ "first", "second", "third" ];
			const action = addKeyword( "fourth" );
			const expected = [ "first", "second", "third", "fourth" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should ignore an already existing keyword", () => {
			const state = [ "first", "second", "third" ];
			const action = addKeyword( "second" );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should insert a keyword at the correct position", () => {
			const state = [ "first", "third" ];
			const action = addKeyword( "second", 1 );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should prepend a keyword when the index is 0", () => {
			const state = [ "second", "third" ];
			const action = addKeyword( "first", 0 );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when you pass nothing", () => {
			const state = [ "first", "second", "third" ];
			const action = addKeyword();
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when you pass an unexpected variable", () => {
			const state = [ "first", "second", "third" ];
			const action = addKeyword( this );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );

	describe( "removeKeyword", () => {
		it( "should remove the first keyword", () => {
			const state = [ "first", "second", "third" ];
			const action = removeKeyword( "first" );
			const expected = [ "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should remove the keyword in the middle", () => {
			const state = [ "first", "second", "third" ];
			const action = removeKeyword( "second" );
			const expected = [ "first", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should remove the keyword at the end", () => {
			const state = [ "first", "second", "third" ];
			const action = removeKeyword( "third" );
			const expected = [ "first", "second" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when the given is not found", () => {
			const state = [ "first", "second", "third" ];
			const action = removeKeyword( "fourth" );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when you pass nothing", () => {
			const state = [ "first", "second", "third" ];
			const action = removeKeyword();
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should not change the keywords when you pass an unexpected variable", () => {
			const state = [ "first", "second", "third" ];
			const action = removeKeyword( this );
			const expected = [ "first", "second", "third" ];
			const actual = keywordsReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );
} );
