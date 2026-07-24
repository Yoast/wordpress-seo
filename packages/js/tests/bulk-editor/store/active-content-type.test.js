import reducer, { activeContentTypeActions, activeContentTypeSelectors, createInitialActiveContentTypeState } from "../../../src/bulk-editor/store/active-content-type";

describe( "active-content-type slice", () => {
	it( "defaults to an empty name, meaning the first available content type", () => {
		expect( createInitialActiveContentTypeState() ).toBe( "" );
	} );

	it( "updates the state via setActiveContentType", () => {
		const state = reducer( "", activeContentTypeActions.setActiveContentType( "post" ) );

		expect( state ).toBe( "post" );
	} );

	it( "selects the active content type name from the store state", () => {
		expect( activeContentTypeSelectors.selectActiveContentTypeName( { activeContentType: "page" } ) ).toBe( "page" );
	} );

	it( "falls back to an empty name when the state is missing", () => {
		expect( activeContentTypeSelectors.selectActiveContentTypeName( {} ) ).toBe( "" );
	} );
} );
