import { renderHook } from "@testing-library/react";
import { dispatch, useSelect } from "@wordpress/data";
import { useYoastMetaSync } from "../../../src/ai-content-planner/hooks/use-yoast-meta-sync";

jest.mock( "@wordpress/data", () => ( {
	dispatch: jest.fn(),
	useSelect: jest.fn(),
} ) );

const mockUpdateData = jest.fn();
const mockSetFocusKeyword = jest.fn();

/**
 * Sets up useSelect to return meta fields from a fake core/editor store.
 *
 * @param {Object} meta The meta object to return from getEditedPostAttribute.
 */
const setupUseSelect = ( meta = {} ) => {
	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		if ( storeName === "core/editor" ) {
			return { getEditedPostAttribute: ( attr ) => attr === "meta" ? meta : null };
		}
	} ) );
};

beforeEach( () => {
	mockUpdateData.mockClear();
	mockSetFocusKeyword.mockClear();
	dispatch.mockReturnValue( { updateData: mockUpdateData, setFocusKeyword: mockSetFocusKeyword } );
	setupUseSelect();
} );

describe( "useYoastMetaSync", () => {
	it( "calls updateData with title and description from meta", () => {
		// eslint-disable-next-line camelcase
		setupUseSelect( { _yoast_wpseo_title: "My title", _yoast_wpseo_metadesc: "My desc" } );

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( { title: "My title", description: "My desc" } );
	} );

	it( "calls setFocusKeyword with the focus keyword from meta", () => {
		// eslint-disable-next-line camelcase
		setupUseSelect( { _yoast_wpseo_focuskw: "my keyword" } );

		renderHook( () => useYoastMetaSync() );

		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "my keyword" );
	} );

	it( "passes undefined when meta fields are absent", () => {
		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( { title: undefined, description: undefined } );
		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( undefined );
	} );

	it( "dispatches to yoast-seo/editor", () => {
		renderHook( () => useYoastMetaSync() );

		expect( dispatch ).toHaveBeenCalledWith( "yoast-seo/editor" );
	} );

	it( "does not throw when the yoast-seo/editor store is not available", () => {
		dispatch.mockReturnValue( null );

		expect( () => renderHook( () => useYoastMetaSync() ) ).not.toThrow();
	} );

	it( "does not throw when the yoast-seo/editor store has no updateData method", () => {
		dispatch.mockReturnValue( { setFocusKeyword: mockSetFocusKeyword } );

		expect( () => renderHook( () => useYoastMetaSync() ) ).not.toThrow();
	} );
} );
