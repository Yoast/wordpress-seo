import { jest } from "@jest/globals";
import { ROOT_ID } from "../../src/bulk-editor/constants";

const mockRender = jest.fn();
const mockCreateRoot = jest.fn( () => ( { render: mockRender } ) );
const mockRegisterStore = jest.fn();
const mockFixScrolling = jest.fn();
const mockRemoteDataProvider = jest.fn();
const mockSelectPreference = jest.fn( () => false );
const mockPreparePromptContent = jest.fn();
const mockGetVisibleContentLength = jest.fn();

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
	getVisibleContentLength: mockGetVisibleContentLength,
	MAX_TOKENS_DEFAULT: 300,
	MAX_TOKENS_IRREGULAR: 150,
} ) );

// The service pulls in the analysis package; the bridge only needs to expose the reference.
jest.mock( "../../src/bulk-editor/services/prompt-content", () => ( {
	preparePromptContent: mockPreparePromptContent,
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
			initialState: {
				linkParams: { foo: "bar" },
				myyoastConnection: {
					isAvailable: false,
					canConnect: false,
					connectUrl: null,
					learnMoreUrl: "",
				},
			},
		} );
		expect( mockFixScrolling ).toHaveBeenCalledTimes( 1 );
		expect( mockCreateRoot ).toHaveBeenCalledWith( root );
		expect( mockRender ).toHaveBeenCalledTimes( 1 );
	} );

	test( "should expose the prompt-content service and its token budgets to Premium", () => {
		jest.isolateModules( () => {
			require( "../../src/bulk-editor/initialize" );
		} );

		// The bridge is populated on import, independently of whether the app mounts.
		expect( window.yoast.bulkEditor.helpers.preparePromptContent ).toBe( mockPreparePromptContent );
		expect( window.yoast.bulkEditor.helpers.getVisibleContentLength ).toBe( mockGetVisibleContentLength );
		expect( window.yoast.bulkEditor.constants ).toEqual( {
			MAX_TOKENS_DEFAULT: 300,
			MAX_TOKENS_IRREGULAR: 150,
		} );
	} );

	test( "should keep the existing bridge entries when exposing its own", () => {
		jest.isolateModules( () => {
			require( "../../src/bulk-editor/initialize" );
		} );

		expect( window.yoast.bulkEditor.components ).toHaveProperty( "UpsellModal" );
		expect( window.yoast.bulkEditor.components ).toHaveProperty( "GenericAlert" );
		expect( window.yoast.bulkEditor.hooks ).toHaveProperty( "useAiUpsell" );
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
