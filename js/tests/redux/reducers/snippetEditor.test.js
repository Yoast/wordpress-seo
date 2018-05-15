import {
	switchMode,
	updateData,
	updateReplacementVariable,
} from "../../../src/redux/actions/snippetEditor";
import snippetEditorReducer from "../../../src/redux/reducers/snippetEditor";
import { DEFAULT_MODE } from "yoast-components";

describe( "snippet editor reducers", () => {
	describe( "snippetEditorReducer", () => {
		it( "has a default state", () => {
			const result = snippetEditorReducer( undefined, { type: "undefined" } );

			expect( result ).toEqual( {
				mode: DEFAULT_MODE,
				data: {
					title: "",
					slug: "",
					description: "",
				},
				replacementVariables: [],
			} );
		} );

		it( "ignores unrecognized actions", () => {
			const state = {};

			const result = snippetEditorReducer( state, { type: "undefined" } );

			expect( result ).toBe( state );
		} );

		it( "switches modes", () => {
			const action = switchMode( "desktop" );
			const expected = { mode: "desktop" };

			const result = snippetEditorReducer( {}, action );

			expect( result ).toEqual( expected );
		} );

		it( "updates the data", () => {
			const action = updateData( { title: "Title" } );
			const expected = { data: { title: "Title" } };

			const result = snippetEditorReducer( {}, action );

			expect( result ).toEqual( expected );
		} );

		it( "updates replacement variables", () => {
			const action = updateReplacementVariable( "title", "Title" );
			const expected = { replacementVariables: [ { name: "title", value: "Title" } ] };

			const result = snippetEditorReducer( { replacementVariables: [] }, action );

			expect( result ).toEqual( expected );
		} );
	} );
} );
