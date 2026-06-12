/**
 * @jest-environment jsdom
 */

jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
	dispatch: jest.fn(),
} ) );

import { select, dispatch } from "@wordpress/data";
import { shouldSkipMetaWrite, writeMetaWithoutUndo, getMetaValue, setMetaValue } from "../../../src/helpers/fields/rest-meta";

describe( "shouldSkipMetaWrite", () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "returns true when entity meta is null (not yet loaded)", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => null } );
		expect( shouldSkipMetaWrite( "_yoast_wpseo_title", "value" ) ).toBe( true );
	} );

	it( "returns true when the new value equals the current meta value", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => ( { "_yoast_wpseo_title": "same" } ) } );
		expect( shouldSkipMetaWrite( "_yoast_wpseo_title", "same" ) ).toBe( true );
	} );

	it( "returns false when the new value differs from the current meta value", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => ( { "_yoast_wpseo_title": "old" } ) } );
		expect( shouldSkipMetaWrite( "_yoast_wpseo_title", "new" ) ).toBe( false );
	} );

	it( "coerces the new value to string before comparing", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => ( { "_yoast_wpseo_linkdex": "100" } ) } );
		expect( shouldSkipMetaWrite( "_yoast_wpseo_linkdex", 100 ) ).toBe( true );
	} );
} );

describe( "writeMetaWithoutUndo", () => {
	const mockEditEntityRecord = jest.fn();

	beforeEach( () => {
		select.mockReturnValue( {
			getCurrentPostType: () => "post",
			getCurrentPostId: () => 42,
		} );
		dispatch.mockImplementation( ( store ) => {
			if ( store === "core" ) {
				return { editEntityRecord: mockEditEntityRecord };
			}
			return {};
		} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "calls editEntityRecord with undoIgnore: true", () => {
		writeMetaWithoutUndo( { "_yoast_wpseo_linkdex": "100" } );
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 42,
			{ meta: { "_yoast_wpseo_linkdex": "100" } },
			{ undoIgnore: true }
		);
	} );

	it( "passes the full meta object through", () => {
		writeMetaWithoutUndo( { "_yoast_wpseo_linkdex": "50", "_yoast_wpseo_content_score": "80" } );
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 42,
			{ meta: { "_yoast_wpseo_linkdex": "50", "_yoast_wpseo_content_score": "80" } },
			{ undoIgnore: true }
		);
	} );
} );

// isRestMetaActive is false by default (no window.wpseoScriptData set).
describe( "getMetaValue (REST meta inactive)", () => {
	it( "returns element.value when element is provided", () => {
		expect( getMetaValue( "_yoast_wpseo_title", { value: "dom-value" }, "" ) ).toBe( "dom-value" );
	} );

	it( "returns the fallback when element is null", () => {
		expect( getMetaValue( "_yoast_wpseo_title", null, "fallback" ) ).toBe( "fallback" );
	} );

	it( "returns the fallback when element.value is undefined", () => {
		expect( getMetaValue( "_yoast_wpseo_title", {}, "fallback" ) ).toBe( "fallback" );
	} );
} );

describe( "setMetaValue (REST meta inactive)", () => {
	it( "sets element.value to the given value", () => {
		const element = { value: "" };
		setMetaValue( "_yoast_wpseo_title", element, "new-value" );
		expect( element.value ).toBe( "new-value" );
	} );

	it( "does nothing when element is null", () => {
		expect( () => setMetaValue( "_yoast_wpseo_title", null, "value" ) ).not.toThrow();
	} );
} );

// Reload the module with isRestMetaActive = true for the REST-active path tests.
describe( "getMetaValue (REST meta active)", () => {
	let getMetaValueActive;
	const mockGetEditedPostAttribute = jest.fn();

	beforeEach( () => {
		jest.resetModules();
		window.wpseoScriptData = { disableMetaboxInBlockEditor: true };
		jest.doMock( "@wordpress/data", () => ( {
			select: jest.fn( () => ( { getEditedPostAttribute: mockGetEditedPostAttribute } ) ),
			dispatch: jest.fn(),
		} ) );
		( { getMetaValue: getMetaValueActive } = require( "../../../src/helpers/fields/rest-meta" ) );
	} );

	afterEach( () => {
		delete window.wpseoScriptData;
		jest.clearAllMocks();
	} );

	it( "reads the value from the core/editor store", () => {
		mockGetEditedPostAttribute.mockReturnValue( { "_yoast_wpseo_title": "REST title" } );
		expect( getMetaValueActive( "_yoast_wpseo_title", null, "" ) ).toBe( "REST title" );
	} );

	it( "returns the fallback when the meta key is absent", () => {
		mockGetEditedPostAttribute.mockReturnValue( {} );
		expect( getMetaValueActive( "_yoast_wpseo_title", null, "fallback" ) ).toBe( "fallback" );
	} );

	it( "ignores the DOM element and reads from the store", () => {
		mockGetEditedPostAttribute.mockReturnValue( { "_yoast_wpseo_title": "REST title" } );
		expect( getMetaValueActive( "_yoast_wpseo_title", { value: "dom-value" }, "" ) ).toBe( "REST title" );
	} );
} );

describe( "setMetaValue (REST meta active)", () => {
	let setMetaValueActive;
	const mockGetEditedPostAttribute = jest.fn();
	const mockEditPost = jest.fn();
	const mockEditEntityRecord = jest.fn();

	beforeEach( () => {
		jest.resetModules();
		window.wpseoScriptData = { disableMetaboxInBlockEditor: true };
		jest.doMock( "@wordpress/data", () => ( {
			select: jest.fn( () => ( {
				getEditedPostAttribute: mockGetEditedPostAttribute,
				getCurrentPostType: () => "post",
				getCurrentPostId: () => 1,
			} ) ),
			dispatch: jest.fn( ( store ) => {
				if ( store === "core/editor" ) {
					return { editPost: mockEditPost };
				}
				if ( store === "core" ) {
					return { editEntityRecord: mockEditEntityRecord };
				}
				return {};
			} ),
		} ) );
		( { setMetaValue: setMetaValueActive } = require( "../../../src/helpers/fields/rest-meta" ) );
	} );

	afterEach( () => {
		delete window.wpseoScriptData;
		jest.clearAllMocks();
	} );

	it( "dispatches editPost when withoutUndo is false (default)", () => {
		mockGetEditedPostAttribute.mockReturnValue( { "_yoast_wpseo_title": "old" } );
		setMetaValueActive( "_yoast_wpseo_title", null, "new" );
		expect( mockEditPost ).toHaveBeenCalledWith( { meta: { "_yoast_wpseo_title": "new" } } );
	} );

	it( "coerces value to string before dispatching", () => {
		mockGetEditedPostAttribute.mockReturnValue( { "_yoast_wpseo_linkdex": "0" } );
		setMetaValueActive( "_yoast_wpseo_linkdex", null, 100 );
		expect( mockEditPost ).toHaveBeenCalledWith( { meta: { "_yoast_wpseo_linkdex": "100" } } );
	} );

	it( "skips dispatch when the value already matches the current meta", () => {
		mockGetEditedPostAttribute.mockReturnValue( { "_yoast_wpseo_title": "same" } );
		setMetaValueActive( "_yoast_wpseo_title", null, "same" );
		expect( mockEditPost ).not.toHaveBeenCalled();
	} );

	it( "dispatches editEntityRecord when withoutUndo is true", () => {
		setMetaValueActive( "_yoast_wpseo_linkdex", null, "100", true );
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 1,
			{ meta: { "_yoast_wpseo_linkdex": "100" } },
			{ undoIgnore: true }
		);
	} );

	it( "does not write to the DOM element in REST mode", () => {
		mockGetEditedPostAttribute.mockReturnValue( {} );
		const element = { value: "original" };
		setMetaValueActive( "_yoast_wpseo_title", element, "new" );
		expect( element.value ).toBe( "original" );
	} );
} );
