import { jest } from "@jest/globals";
import { ROOT_ID, TOUR_OPT_IN_KEY } from "../../src/bulk-editor/constants";

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
			optInNotificationSeen: { [ TOUR_OPT_IN_KEY ]: true },
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
				optInNotification: { seen: { [ TOUR_OPT_IN_KEY ]: true } },
				myyoastConnection: {
					isAvailable: false,
					canConnect: false,
					connectUrl: null,
					learnMoreUrl: "",
				},
				activeContentType: "",
				selection: { selectedIds: [], preselectedTotal: 0 },
				query: { overviewIds: [], isOverviewFilterActive: false },
			},
		} );
		expect( mockFixScrolling ).toHaveBeenCalledTimes( 1 );
		expect( mockCreateRoot ).toHaveBeenCalledWith( root );
		expect( mockRender ).toHaveBeenCalledTimes( 1 );
	} );

	test( "should seed the store with the selection carried over from the WP admin overview", () => {
		const root = document.createElement( "div" );
		root.id = ROOT_ID;
		document.body.appendChild( root );
		window.wpseoBulkEditorData.initialSelection = { contentType: "page", postIds: [ 5, 3 ], selectedCount: 25 };

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
				activeContentType: "page",
				selection: { selectedIds: [ 5, 3 ], preselectedTotal: 25 },
				query: { overviewIds: [ 5, 3 ], isOverviewFilterActive: true },
			},
		} );
	} );

	describe( "getPreselectionState", () => {
		/**
		 * Requires the module in isolation and returns the getPreselectionState export.
		 *
		 * @returns {Function} The getPreselectionState function.
		 */
		const requireGetPreselectionState = () => {
			let getPreselectionState;
			jest.isolateModules( () => {
				( { getPreselectionState } = require( "../../src/bulk-editor/initialize" ) );
			} );
			return getPreselectionState;
		};

		test( "should return an empty seed for a missing or malformed payload", () => {
			const getPreselectionState = requireGetPreselectionState();

			const emptySeed = {
				activeContentType: "",
				selection: { selectedIds: [], preselectedTotal: 0 },
				query: { overviewIds: [], isOverviewFilterActive: false },
			};
			expect( getPreselectionState() ).toEqual( emptySeed );
			expect( getPreselectionState( { contentType: 7, postIds: "5,3", selectedCount: 25 } ) ).toEqual( emptySeed );
		} );

		test( "should drop non-numeric and non-positive ids and never let the total undercut them", () => {
			const getPreselectionState = requireGetPreselectionState();

			expect( getPreselectionState( { contentType: "post", postIds: [ "5", 3, 0, -2, "junk" ], selectedCount: 1 } ) ).toEqual( {
				activeContentType: "post",
				selection: { selectedIds: [ 5, 3 ], preselectedTotal: 2 },
				query: { overviewIds: [ 5, 3 ], isOverviewFilterActive: true },
			} );
		} );

		test( "should cap the seeded ids at the batch size", () => {
			const getPreselectionState = requireGetPreselectionState();

			const postIds = Array.from( { length: 25 }, ( _, index ) => index + 1 );
			const { selection } = getPreselectionState( { contentType: "post", postIds, selectedCount: 25 } );

			expect( selection.selectedIds ).toHaveLength( 20 );
			expect( selection.preselectedTotal ).toBe( 25 );
		} );

		test( "should not report a carried-over total without any usable ids", () => {
			const getPreselectionState = requireGetPreselectionState();

			expect( getPreselectionState( { contentType: "post", postIds: [], selectedCount: 25 } ) ).toEqual( {
				activeContentType: "post",
				selection: { selectedIds: [], preselectedTotal: 0 },
				query: { overviewIds: [], isOverviewFilterActive: false },
			} );
		} );
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
