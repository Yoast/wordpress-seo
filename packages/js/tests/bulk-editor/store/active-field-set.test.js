import reducer, { activeFieldSetActions, activeFieldSetSelectors, createInitialActiveFieldSetState } from "../../../src/bulk-editor/store/active-field-set";
import { FIELD_SET_SEARCH, FIELD_SET_SOCIAL } from "../../../src/bulk-editor/constants";

describe( "active-field-set slice", () => {
	it( "defaults to the search field set", () => {
		expect( createInitialActiveFieldSetState() ).toBe( FIELD_SET_SEARCH );
	} );

	it( "updates the state via setActiveFieldSet", () => {
		const state = reducer( FIELD_SET_SEARCH, activeFieldSetActions.setActiveFieldSet( FIELD_SET_SOCIAL ) );

		expect( state ).toBe( FIELD_SET_SOCIAL );
	} );

	it( "selects the active field set from the store state", () => {
		expect( activeFieldSetSelectors.selectActiveFieldSet( { activeFieldSet: FIELD_SET_SOCIAL } ) ).toBe( FIELD_SET_SOCIAL );
	} );

	it( "falls back to the search field set when the state is missing", () => {
		expect( activeFieldSetSelectors.selectActiveFieldSet( {} ) ).toBe( FIELD_SET_SEARCH );
	} );
} );
