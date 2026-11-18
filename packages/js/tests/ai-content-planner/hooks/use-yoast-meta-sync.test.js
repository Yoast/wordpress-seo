import { renderHook, act } from "@testing-library/react";
import { useDispatch, useSelect } from "@wordpress/data";
import { useYoastMetaSync } from "../../../src/ai-content-planner/hooks/use-yoast-meta-sync";

jest.mock( "@wordpress/data", () => ( {
	useDispatch: jest.fn(),
	useSelect: jest.fn(),
} ) );

const mockUpdateData = jest.fn();
const mockSetFocusKeyword = jest.fn();

/**
 * Sets up useSelect to return meta fields and templates from fake stores.
 *
 * @param {Object} meta      The meta object to return from getEditedPostAttribute.
 * @param {string} postType  The post type to return from getCurrentPostType.
 * @param {Object} templates The templates to return from getSnippetEditorTemplates.
 */
const setupUseSelect = ( meta = {}, postType = "post", templates = { title: "", description: "" } ) => {
	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		if ( storeName === "core/editor" ) {
			return {
				getEditedPostAttribute: ( attr ) => attr === "meta" ? meta : null,
				getCurrentPostType: () => postType,
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return {
				getSnippetEditorTemplates: () => templates,
			};
		}
	} ) );
};

beforeEach( () => {
	mockUpdateData.mockClear();
	mockSetFocusKeyword.mockClear();
	useDispatch.mockReturnValue( { updateData: mockUpdateData, setFocusKeyword: mockSetFocusKeyword } );
	setupUseSelect();
} );

describe( "useYoastMetaSync", () => {
	it( "calls updateData with title and description from meta when both are non-empty", () => {
		// eslint-disable-next-line camelcase
		setupUseSelect( { _yoast_wpseo_title: "My title", _yoast_wpseo_metadesc: "My desc" } );

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( { title: "My title", description: "My desc" } );
	} );

	it( "falls back to title template when yoast title meta is empty", () => {
		// The REST API returns "" when no custom SEO title is saved; the template should show instead.
		setupUseSelect(
			// eslint-disable-next-line camelcase
			{ _yoast_wpseo_title: "", _yoast_wpseo_metadesc: "My desc" },
			"post",
			{ title: "%%title%% %%sep%% %%sitename%%", description: "" }
		);

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( { title: "%%title%% %%sep%% %%sitename%%", description: "My desc" } );
	} );

	it( "falls back to description template when yoast description meta is empty", () => {
		setupUseSelect(
			// eslint-disable-next-line camelcase
			{ _yoast_wpseo_title: "My title", _yoast_wpseo_metadesc: "" },
			"post",
			{ title: "", description: "%%excerpt%%" }
		);

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( { title: "My title", description: "%%excerpt%%" } );
	} );

	it( "falls back to both templates when all meta fields are empty (initial load, no custom values saved)", () => {
		setupUseSelect(
			// eslint-disable-next-line camelcase
			{ _yoast_wpseo_title: "", _yoast_wpseo_metadesc: "", _yoast_wpseo_focuskw: "" },
			"post",
			{ title: "%%title%% %%sep%% %%sitename%%", description: "%%excerpt%%" }
		);

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( {
			title: "%%title%% %%sep%% %%sitename%%",
			description: "%%excerpt%%",
		} );
		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "" );
	} );

	it( "calls setFocusKeyword with the focus keyword from meta", () => {
		// eslint-disable-next-line camelcase
		setupUseSelect( { _yoast_wpseo_focuskw: "my keyword" } );

		renderHook( () => useYoastMetaSync() );

		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "my keyword" );
	} );

	it( "calls setFocusKeyword with empty string when focus keyword is absent", () => {
		renderHook( () => useYoastMetaSync() );

		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "" );
	} );

	it( "restores templates after undo reverts title and description to empty", () => {
		// Simulate the content planner setting values, then the user undoing.
		setupUseSelect(
			// eslint-disable-next-line camelcase
			{ _yoast_wpseo_title: "Generated title", _yoast_wpseo_metadesc: "Generated desc" },
			"post",
			{ title: "%%title%% %%sep%% %%sitename%%", description: "%%excerpt%%" }
		);
		const { rerender } = renderHook( () => useYoastMetaSync() );

		mockUpdateData.mockClear();

		// Undo reverts both fields back to empty.
		setupUseSelect(
			// eslint-disable-next-line camelcase
			{ _yoast_wpseo_title: "", _yoast_wpseo_metadesc: "" },
			"post",
			{ title: "%%title%% %%sep%% %%sitename%%", description: "%%excerpt%%" }
		);
		act( () => {
			rerender();
		} );

		expect( mockUpdateData ).toHaveBeenCalledWith( {
			title: "%%title%% %%sep%% %%sitename%%",
			description: "%%excerpt%%",
		} );
	} );

	it( "calls setFocusKeyword with empty string after undo reverts focus keyword to empty", () => {
		// eslint-disable-next-line camelcase
		setupUseSelect( { _yoast_wpseo_focuskw: "my keyword" } );
		const { rerender } = renderHook( () => useYoastMetaSync() );

		mockSetFocusKeyword.mockClear();

		// eslint-disable-next-line camelcase
		setupUseSelect( { _yoast_wpseo_focuskw: "" } );
		act( () => {
			rerender();
		} );

		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "" );
	} );

	it( "does not dispatch when the post type is not 'post'", () => {
		setupUseSelect( {}, "page" );

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).not.toHaveBeenCalled();
		expect( mockSetFocusKeyword ).not.toHaveBeenCalled();
	} );

	it( "uses non-empty suggestion values over templates when content planner applies suggestions", () => {
		// Simulate the content planner writing generated values to core/editor meta.
		setupUseSelect(
			{
				// eslint-disable-next-line camelcase
				_yoast_wpseo_title: "Generated title",
				// eslint-disable-next-line camelcase
				_yoast_wpseo_metadesc: "Generated description",
				// eslint-disable-next-line camelcase
				_yoast_wpseo_focuskw: "generated keyword",
			},
			"post",
			{ title: "%%title%% %%sep%% %%sitename%%", description: "%%excerpt%%" }
		);

		renderHook( () => useYoastMetaSync() );

		expect( mockUpdateData ).toHaveBeenCalledWith( {
			title: "Generated title",
			description: "Generated description",
		} );
		expect( mockSetFocusKeyword ).toHaveBeenCalledWith( "generated keyword" );
	} );
} );
