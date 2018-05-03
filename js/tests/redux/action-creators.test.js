import {
	SWITCH_MODE,
	UPDATE_DATA,
	UPDATE_REPLACEMENT_VARIABLE,
	INSERT_REPLACEMENT_VARIABLE,
	switchMode,
	updateData,
	updateReplacementVariable,
	insertReplacementVariable,
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
			expect( updateReplacementVariable( "title", "Title" ) ).toEqual( {
				type: UPDATE_REPLACEMENT_VARIABLE,
				name: "title",
				value: "Title",
			} );
		} );
	} );

	describe( "insertReplacementVariable", () => {
		it( "returns an action", () => {
			expect( insertReplacementVariable( "title", "Title" ) ).toEqual( {
				type: INSERT_REPLACEMENT_VARIABLE,
				name: "title",
				value: "Title",
			} );
		} );
	} );
} );
