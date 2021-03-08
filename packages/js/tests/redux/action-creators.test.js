import {
	SWITCH_MODE,
	UPDATE_DATA,
	UPDATE_REPLACEMENT_VARIABLE,
	switchMode,
	updateData,
	updateReplacementVariable,
} from "../../src/redux/actions/snippetEditor";

describe( "snippet editor action creators", () => {
	describe( "switchMode", () => {
		it( "returns an action", () => {
			expect( switchMode( "mobile" ) ).toEqual( {
				type: SWITCH_MODE,
				mode: "mobile",
			} );
		} );
	} );

	describe( "updateData", () => {
		it( "return an action", () => {
			const data = { title: "title" };

			expect( updateData( data ) ).toEqual( {
				type: UPDATE_DATA,
				data,
			} );
		} );
	} );

	describe( "updateReplacementVariable", () => {
		it( "returns an action", () => {
			expect( updateReplacementVariable( "title", "Title", "Label" ) ).toEqual( {
				type: UPDATE_REPLACEMENT_VARIABLE,
				name: "title",
				value: "Title",
				label: "Label",
			} );
		} );
		it( "returns an action with an empty label when no label is passed", () => {
			expect( updateReplacementVariable( "title", "Title" ) ).toEqual( {
				type: UPDATE_REPLACEMENT_VARIABLE,
				name: "title",
				value: "Title",
				label: "",
			} );
		} );
	} );
} );
