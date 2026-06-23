import { jest } from "@jest/globals";
import { ROOT_ID } from "../../src/bulk-editor/constants";

const mockRender = jest.fn();
const mockCreateRoot = jest.fn( () => ( { render: mockRender } ) );
const mockRegisterStore = jest.fn();
const mockFixScrolling = jest.fn();
const mockRemoteDataProvider = jest.fn();
const mockSelectPreference = jest.fn( () => false );

jest.mock( "@wordpress/dom-ready", () => ( {
	__esModule: true,
	"default": ( callback ) => callback(),
} ) );

jest.mock( "@wordpress/element", () => ( {
	createRoot: ( ...args ) => mockCreateRoot( ...args ),
} ) );

jest.mock( "@wordpress/components", () => ( {
	SlotFillProvider: ( { children } ) => children,
} ) );

jest.mock( "@wordpress/plugins", () => ( {
	PluginArea: () => null,
} ) );

jest.mock( "@wordpress/data", () => ( {
	select: () => ( { selectPreference: mockSelectPreference } ),
} ) );

jest.mock( "react-router-dom", () => ( {
	createHashRouter: () => ( {} ),
	createRoutesFromElements: () => ( {} ),
	Route: () => null,
	RouterProvider: () => null,
} ) );

jest.mock( "@yoast/dashboard-frontend", () => ( {
	RemoteDataProvider: function( options ) {
		mockRemoteDataProvider( options );
	},
} ) );

jest.mock( "../../src/bulk-editor/store", () => ( {
	__esModule: true,
	"default": ( ...args ) => mockRegisterStore( ...args ),
} ) );

jest.mock( "../../src/shared-admin/helpers", () => ( {
	fixWordPressMenuScrolling: () => mockFixScrolling(),
} ) );

describe( "bulk editor initialize", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		jest.resetModules();
		document.body.replaceChildren();
		window.wpseoBulkEditorData = {
			contentTypes: [ { name: "post", label: "Posts" } ],
			linkParams: { foo: "bar" },
			nonce: "test-nonce",
		};
	} );

	test( "should not mount when the root element is absent", () => {
		jest.isolateModules( () => {
			require( "../../src/bulk-editor/initialize" );
		} );

		expect( mockCreateRoot ).not.toHaveBeenCalled();
		expect( mockRegisterStore ).not.toHaveBeenCalled();
	} );

	test( "should register the store and mount the app when the root element exists", () => {
		const root = document.createElement( "div" );
		root.id = ROOT_ID;
		document.body.appendChild( root );

		jest.isolateModules( () => {
			require( "../../src/bulk-editor/initialize" );
		} );

		expect( mockRegisterStore ).toHaveBeenCalledWith( {
			initialState: { linkParams: { foo: "bar" } },
		} );
		expect( mockFixScrolling ).toHaveBeenCalledTimes( 1 );
		expect( mockCreateRoot ).toHaveBeenCalledWith( root );
		expect( mockRender ).toHaveBeenCalledTimes( 1 );
	} );

	test( "should construct the remote data provider with the REST nonce header", () => {
		const root = document.createElement( "div" );
		root.id = ROOT_ID;
		document.body.appendChild( root );

		jest.isolateModules( () => {
			require( "../../src/bulk-editor/initialize" );
		} );

		expect( mockRemoteDataProvider ).toHaveBeenCalledWith( {
			headers: { "X-WP-Nonce": "test-nonce" },
		} );
	} );
} );
