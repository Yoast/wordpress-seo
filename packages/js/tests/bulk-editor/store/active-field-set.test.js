import reducer, { activeFieldSetActions, activeFieldSetSelectors, createInitialActiveFieldSetState } from "../../../src/bulk-editor/store/active-field-set";
import { activeContentTypeActions } from "../../../src/bulk-editor/store/active-content-type";
import { FIELD_SET_IMAGE_ALT_TEXT, FIELD_SET_SEARCH, FIELD_SET_SOCIAL, PRODUCT_CONTENT_TYPE } from "../../../src/bulk-editor/constants";

describe( "active-field-set slice", () => {
	it( "defaults to the search field set", () => {
		expect( createInitialActiveFieldSetState() ).toBe( FIELD_SET_SEARCH );
	} );

	it( "updates the state via setActiveFieldSet", () => {
		const state = reducer( FIELD_SET_SEARCH, activeFieldSetActions.setActiveFieldSet( FIELD_SET_SOCIAL ) );

		expect( state ).toBe( FIELD_SET_SOCIAL );
	} );

	it( "accepts the image-alt-text tab id", () => {
		const state = reducer( FIELD_SET_SEARCH, activeFieldSetActions.setActiveFieldSet( FIELD_SET_IMAGE_ALT_TEXT ) );

		expect( state ).toBe( FIELD_SET_IMAGE_ALT_TEXT );
	} );

	it( "ignores unknown field set ids", () => {
		const state = reducer( FIELD_SET_SOCIAL, activeFieldSetActions.setActiveFieldSet( "nonsense" ) );

		expect( state ).toBe( FIELD_SET_SOCIAL );
	} );

	it( "selects the active field set from the store state", () => {
		expect( activeFieldSetSelectors.selectActiveFieldSet( { activeFieldSet: FIELD_SET_SOCIAL } ) ).toBe( FIELD_SET_SOCIAL );
	} );

	it( "falls back to the search field set when the state is missing", () => {
		expect( activeFieldSetSelectors.selectActiveFieldSet( {} ) ).toBe( FIELD_SET_SEARCH );
	} );

	it( "resets from image-alt-text to search when the content type switches away from products", () => {
		const state = reducer( FIELD_SET_IMAGE_ALT_TEXT, activeContentTypeActions.setActiveContentType( "post" ) );

		expect( state ).toBe( FIELD_SET_SEARCH );
	} );

	it( "keeps the image-alt-text tab active when the content type switch stays on products", () => {
		const state = reducer( FIELD_SET_IMAGE_ALT_TEXT, activeContentTypeActions.setActiveContentType( PRODUCT_CONTENT_TYPE ) );

		expect( state ).toBe( FIELD_SET_IMAGE_ALT_TEXT );
	} );

	it( "leaves a non-image-alt-text active field set untouched on a content type switch", () => {
		const state = reducer( FIELD_SET_SOCIAL, activeContentTypeActions.setActiveContentType( "post" ) );

		expect( state ).toBe( FIELD_SET_SOCIAL );
	} );
} );
