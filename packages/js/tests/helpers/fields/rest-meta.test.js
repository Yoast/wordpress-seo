jest.mock( "@wordpress/data", () => ( {
	select: jest.fn(),
	dispatch: jest.fn(),
} ) );

import { select, dispatch } from "@wordpress/data";
import { shouldSkipMetaWrite, writeMetaWithoutUndo, getMetaValue, setMetaValue } from "../../../src/helpers/fields/rest-meta";
import { metaKeyTitle, metaKeyLinkdex, metaKeyContentScore } from "../../../src/shared-admin/constants/meta-keys";

describe( "shouldSkipMetaWrite", () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( "returns true when entity meta is null (not yet loaded)", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => null } );
		expect( shouldSkipMetaWrite( metaKeyTitle, "value" ) ).toBe( true );
	} );

	it( "returns true when the new value equals the current meta value", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => ( { [ metaKeyTitle ]: "same" } ) } );
		expect( shouldSkipMetaWrite( metaKeyTitle, "same" ) ).toBe( true );
	} );

	it( "returns false when the new value differs from the current meta value", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => ( { [ metaKeyTitle ]: "old" } ) } );
		expect( shouldSkipMetaWrite( metaKeyTitle, "new" ) ).toBe( false );
	} );

	it( "coerces the new value to string before comparing", () => {
		select.mockReturnValue( { getEditedPostAttribute: () => ( { [ metaKeyLinkdex ]: "100" } ) } );
		expect( shouldSkipMetaWrite( metaKeyLinkdex, 100 ) ).toBe( true );
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
		writeMetaWithoutUndo( { [ metaKeyLinkdex ]: "100" } );
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 42,
			{ meta: { [ metaKeyLinkdex ]: "100" } },
			{ undoIgnore: true }
		);
	} );

	it( "passes the full meta object through", () => {
		writeMetaWithoutUndo( { [ metaKeyLinkdex ]: "50", [ metaKeyContentScore ]: "80" } );
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 42,
			{ meta: { [ metaKeyLinkdex ]: "50", [ metaKeyContentScore ]: "80" } },
			{ undoIgnore: true }
		);
	} );
} );

// isRestMetaActive is false by default (no window.wpseoScriptData set).
describe( "getMetaValue (REST meta inactive)", () => {
	it( "returns element.value when element is provided", () => {
		expect( getMetaValue( metaKeyTitle, { value: "dom-value" }, "" ) ).toBe( "dom-value" );
	} );

	it( "returns the fallback when element is null", () => {
		expect( getMetaValue( metaKeyTitle, null, "fallback" ) ).toBe( "fallback" );
	} );

	it( "returns the fallback when element.value is undefined", () => {
		expect( getMetaValue( metaKeyTitle, {}, "fallback" ) ).toBe( "fallback" );
	} );
} );

describe( "setMetaValue (REST meta inactive)", () => {
	it( "sets element.value to the given value", () => {
		const element = { value: "" };
		setMetaValue( metaKeyTitle, element, "new-value" );
		expect( element.value ).toBe( "new-value" );
	} );

	it( "does nothing when element is null", () => {
		expect( () => setMetaValue( metaKeyTitle, null, "value" ) ).not.toThrow();
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
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyTitle ]: "REST title" } );
		expect( getMetaValueActive( metaKeyTitle, null, "" ) ).toBe( "REST title" );
	} );

	it( "returns the fallback when the meta key is absent", () => {
		mockGetEditedPostAttribute.mockReturnValue( {} );
		expect( getMetaValueActive( metaKeyTitle, null, "fallback" ) ).toBe( "fallback" );
	} );

	it( "ignores the DOM element and reads from the store", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyTitle ]: "REST title" } );
		expect( getMetaValueActive( metaKeyTitle, { value: "dom-value" }, "" ) ).toBe( "REST title" );
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
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyTitle ]: "old" } );
		setMetaValueActive( metaKeyTitle, null, "new" );
		expect( mockEditPost ).toHaveBeenCalledWith( { meta: { [ metaKeyTitle ]: "new" } } );
	} );

	it( "coerces value to string before dispatching", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyLinkdex ]: "0" } );
		setMetaValueActive( metaKeyLinkdex, null, 100 );
		expect( mockEditPost ).toHaveBeenCalledWith( { meta: { [ metaKeyLinkdex ]: "100" } } );
	} );

	it( "skips dispatch when the value already matches the current meta", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyTitle ]: "same" } );
		setMetaValueActive( metaKeyTitle, null, "same" );
		expect( mockEditPost ).not.toHaveBeenCalled();
	} );

	it( "dispatches editEntityRecord when withoutUndo is true", () => {
		setMetaValueActive( metaKeyLinkdex, null, "100", true );
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 1,
			{ meta: { [ metaKeyLinkdex ]: "100" } },
			{ undoIgnore: true }
		);
	} );

	it( "does not write to the DOM element in REST mode", () => {
		mockGetEditedPostAttribute.mockReturnValue( {} );
		const element = { value: "original" };
		setMetaValueActive( metaKeyTitle, element, "new" );
		expect( element.value ).toBe( "original" );
	} );
} );
