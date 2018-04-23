import {
	SNIPPET_EDITOR_SWITCH_MODE, SNIPPET_EDITOR_UPDATE_DATA,
	SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE,
	switchMode, updateData, updateReplacementVariable,
} from "../../src/redux/actions/snippetEditor";

describe( "snippet editor action creators", () => {
	describe( "switchMode", () => {
		it( "returns an action", () => {
			expect( switchMode( "mobile" ) ).toEqual( {
				type: SNIPPET_EDITOR_SWITCH_MODE,
				mode: "mobile",
			} );
		} );
	} );

	describe( "updateData", () => {
		it( "return an action", () => {
			const data = { title: "title" };

			expect( updateData( data ) ).toEqual( {
				type: SNIPPET_EDITOR_UPDATE_DATA,
				data,
			} );
		} );
	} );

	describe( "updateReplacementVariable", () => {
		it( "returns an action", () => {
			expect( updateReplacementVariable( "title", "Title" ) ).toEqual( {
				type: SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE,
				name: "title",
				value: "Title",
			} );
		} );
	} );
} );
