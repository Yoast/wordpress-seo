import {
	switchMode,
	updateData,
	updateReplacementVariable,
	removeReplacementVariable,
} from "../../../src/redux/actions/snippetEditor";
import snippetEditorReducer from "../../../src/redux/reducers/snippetEditor";
import { DEFAULT_MODE } from "yoast-components";
import getDefaultReplaceVariables from "../../../src/values/defaultReplaceVariables";

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
				replacementVariables: getDefaultReplaceVariables(),
				uniqueRefreshValue: "",
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

		it( "updates replacement variables with a new label, updates the label", () => {
			const action = updateReplacementVariable( "title", "New title", "New label" );
			const expected = { replacementVariables: [ { name: "title", value: "New title", label: "New label" } ] };

			const result = snippetEditorReducer( { replacementVariables: [ { name: "title", value: "Old title", label: "Old label" } ] }, action );

			expect( result ).toEqual( expected );
		} );

		it( "unescapes/decodes strings in replacement variable values, including variants of the apostrophe", () => {
			// Value parameter contains all the necessary html entities for the separator. Separators such as |, *, ~ etc. don't need to be escaped.
			const action = updateReplacementVariable(
				"title",
				"&ndash;&mdash;&middot;&bull;&Star;&laquo;&raquo;&lt;&gt;&quot;&grave;&apos;&#039;&#39;",
				"New label"
			);
			const expected = { replacementVariables: [ { name: "title", value: "–—·•⋆«»<>\"`'''", label: "New label" } ] };

			const result = snippetEditorReducer( { replacementVariables: [ { name: "title", value: "Old title", label: "Old label" } ] }, action );

			expect( result ).toEqual( expected );
		} );

		it( "updates replacement variables without a new label, keeps the old label", () => {
			const action = updateReplacementVariable( "title", "New title" );
			const expected = { replacementVariables: [ { name: "title", value: "New title", label: "Old label" } ] };

			const result = snippetEditorReducer( { replacementVariables: [ { name: "title", value: "Old title", label: "Old label" } ] }, action );

			expect( result ).toEqual( expected );
		} );

		it( "adds replacement variables with no label passed", () => {
			const action = updateReplacementVariable( "New key", "New value" );
			const expected = { replacementVariables: [ { name: "New key", value: "New value", label: "New key" } ] };

			const result = snippetEditorReducer( { replacementVariables: [] }, action );

			expect( result ).toEqual( expected );
		} );

		it( "adds replacement variables with a label passed", () => {
			const action = updateReplacementVariable( "New key", "New value", "New label" );
			const expected = { replacementVariables: [ { name: "New key", value: "New value", label: "New label" } ] };

			const result = snippetEditorReducer( { replacementVariables: [] }, action );

			expect( result ).toEqual( expected );
		} );

		it( "removes replacement variables", () => {
			const action = removeReplacementVariable( "title" );
			const expected = { replacementVariables: [ ] };

			const result = snippetEditorReducer( { replacementVariables: [ { name: "title", value: "value" } ] }, action );

			expect( result ).toEqual( expected );
		} );
	} );
} );
