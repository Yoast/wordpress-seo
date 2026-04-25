/**
 * Tests for the Yoast RTC meta sync bridge
 * (`packages/js/src/initializers/rtc-meta-sync.js`).
 *
 * The bridge mediates between the `yoast-seo/editor` Redux store and the
 * WordPress `core/editor` post meta so that Gutenberg 23.0+'s Real-Time
 * Collaboration can synchronize Yoast SEO fields across concurrent editors.
 * These tests drive the `@wordpress/data` subscribe callback by hand so we
 * can assert both directions of the bridge, the hidden-field mirror, and the
 * per-key reentry guard without spinning up a real editor.
 */

/* eslint-disable camelcase, dot-notation, stylistic/quote-props --
 * All meta-key references in this file match Yoast's DB-level names which
 * are snake_case/kebab-case, so the three rules conflict by design. */

let mockSubscribeListener = null;
let mockYoastState = {};
let mockMetaState = {};
let mockRtcEnabled = true;
let mockPostType = "post";
let mockPostId = 123;

const mockEditEntityRecord = jest.fn();

const mockYoastActions = {
	setFocusKeyword: jest.fn( ( value ) => {
		mockYoastState.focuskw = value;
	} ),
	updateData: jest.fn( ( data ) => {
		mockYoastState.snippet = { ...mockYoastState.snippet, ...data };
	} ),
	setCornerstoneContent: jest.fn( ( isCornerstone ) => {
		mockYoastState.isCornerstone = isCornerstone;
	} ),
	setNoIndex: jest.fn( ( value ) => {
		mockYoastState.noIndex = value;
	} ),
	setNoFollow: jest.fn( ( value ) => {
		mockYoastState.noFollow = value;
	} ),
	setAdvanced: jest.fn( ( value ) => {
		mockYoastState.advanced = value;
	} ),
	setBreadcrumbsTitle: jest.fn( ( value ) => {
		mockYoastState.breadcrumbsTitle = value;
	} ),
	setCanonical: jest.fn( ( value ) => {
		mockYoastState.canonical = value;
	} ),
	setPageType: jest.fn( ( value ) => {
		mockYoastState.pageType = value;
	} ),
	setArticleType: jest.fn( ( value ) => {
		mockYoastState.articleType = value;
	} ),
	setFacebookPreviewTitle: jest.fn( ( value ) => {
		mockYoastState.facebookTitle = value;
	} ),
	setFacebookPreviewDescription: jest.fn( ( value ) => {
		mockYoastState.facebookDescription = value;
	} ),
	setTwitterPreviewTitle: jest.fn( ( value ) => {
		mockYoastState.twitterTitle = value;
	} ),
	setTwitterPreviewDescription: jest.fn( ( value ) => {
		mockYoastState.twitterDescription = value;
	} ),
};

jest.mock( "@wordpress/data", () => ( {
	subscribe: ( listener ) => {
		mockSubscribeListener = listener;
		return () => {
			mockSubscribeListener = null;
		};
	},
	select: ( storeName ) => {
		if ( storeName === "core/editor" ) {
			return {
				isCollaborationEnabledForCurrentPost: () => mockRtcEnabled,
				getCurrentPostType: () => mockPostType,
				getCurrentPostId: () => mockPostId,
			};
		}
		if ( storeName === "core" ) {
			return {
				getEditedEntityRecord: () => ( { meta: { ...mockMetaState } } ),
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return {
				getFocusKeyphrase: () => mockYoastState.focuskw ?? "",
				getSnippetEditorData: () => ( { title: "", description: "", slug: "", ...mockYoastState.snippet } ),
				isCornerstoneContent: () => mockYoastState.isCornerstone ?? false,
				getNoIndex: () => mockYoastState.noIndex ?? "",
				getNoFollow: () => mockYoastState.noFollow ?? "",
				getAdvanced: () => mockYoastState.advanced ?? [],
				getBreadcrumbsTitle: () => mockYoastState.breadcrumbsTitle ?? "",
				getCanonical: () => mockYoastState.canonical ?? "",
				getPageType: () => mockYoastState.pageType ?? "",
				getArticleType: () => mockYoastState.articleType ?? "",
				getFacebookTitle: () => mockYoastState.facebookTitle ?? "",
				getFacebookDescription: () => mockYoastState.facebookDescription ?? "",
				getTwitterTitle: () => mockYoastState.twitterTitle ?? "",
				getTwitterDescription: () => mockYoastState.twitterDescription ?? "",
			};
		}
		return null;
	},
	dispatch: ( storeName ) => {
		if ( storeName === "yoast-seo/editor" ) {
			return mockYoastActions;
		}
		if ( storeName === "core" ) {
			return { editEntityRecord: mockEditEntityRecord };
		}
		return {};
	},
} ) );

import initRtcMetaSync from "../../src/initializers/rtc-meta-sync";

const resetState = () => {
	mockSubscribeListener = null;
	mockYoastState = {};
	mockMetaState = {};
	mockRtcEnabled = true;
	mockPostType = "post";
	mockPostId = 123;
	mockEditEntityRecord.mockClear();
	for ( const action of Object.values( mockYoastActions ) ) {
		action.mockClear();
	}
	document.body.innerHTML = "";
};

const installHiddenField = ( internalKey, initialValue = "" ) => {
	const input = document.createElement( "input" );
	input.type = "hidden";
	input.id = `yoast_wpseo_${ internalKey }`;
	input.value = initialValue;
	document.body.appendChild( input );
	return input;
};

describe( "rtc-meta-sync", () => {
	beforeEach( resetState );

	it( "no-ops when RTC is not supported by core/editor", () => {
		mockRtcEnabled = false;
		const teardown = initRtcMetaSync();
		expect( mockSubscribeListener ).toBeNull();
		teardown();
	} );

	it( "subscribes once when RTC is enabled", () => {
		initRtcMetaSync();
		expect( typeof mockSubscribeListener ).toBe( "function" );
	} );

	it( "mirrors a local Yoast focus keyword change into core-data meta", () => {
		initRtcMetaSync();
		mockYoastState.focuskw = "blue widgets";
		mockSubscribeListener();
		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType",
			"post",
			123,
			{ meta: { _yoast_wpseo_focuskw: "blue widgets" } }
		);
	} );

	it( "mirrors a remote core-data meta change into the Yoast store and the hidden field", () => {
		const input = installHiddenField( "focuskw", "" );
		initRtcMetaSync();
		// Prime snapshots so the first subscribe call establishes baseline.
		mockSubscribeListener();

		mockMetaState[ "_yoast_wpseo_focuskw" ] = "red widgets";
		mockSubscribeListener();

		expect( mockYoastActions.setFocusKeyword ).toHaveBeenCalledWith( "red widgets" );
		expect( input.value ).toBe( "red widgets" );
	} );

	it( "does not bounce a locally-originated edit back into core-data via the echo path", () => {
		initRtcMetaSync();
		mockSubscribeListener();

		mockYoastState.focuskw = "localedit";
		// Outbound — writes to core-data.
		mockSubscribeListener();
		expect( mockEditEntityRecord ).toHaveBeenCalledTimes( 1 );

		// Simulate core-data confirming the edit on the next tick.
		mockMetaState[ "_yoast_wpseo_focuskw" ] = "localedit";
		mockSubscribeListener();

		// No extra Yoast dispatch, no extra core-data write.
		expect( mockYoastActions.setFocusKeyword ).not.toHaveBeenCalled();
		expect( mockEditEntityRecord ).toHaveBeenCalledTimes( 1 );
	} );

	it( "does not bounce a remotely-originated edit back into Yoast's dispatch twice", () => {
		initRtcMetaSync();
		mockSubscribeListener();

		mockMetaState[ "_yoast_wpseo_focuskw" ] = "remote";
		// Inbound — dispatches Yoast action.
		mockSubscribeListener();
		expect( mockYoastActions.setFocusKeyword ).toHaveBeenCalledTimes( 1 );

		// Simulate Yoast store echoing the value back to the selector.
		mockYoastState.focuskw = "remote";
		mockSubscribeListener();

		// No extra Yoast dispatch, no extra core-data write.
		expect( mockYoastActions.setFocusKeyword ).toHaveBeenCalledTimes( 1 );
		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
	} );

	it( "translates meta-robots-adv between Yoast's array shape and the comma-separated DB form", () => {
		installHiddenField( "meta-robots-adv", "" );
		initRtcMetaSync();
		mockSubscribeListener();

		// Inbound: comma-separated string from DB should become an array.
		mockMetaState[ "_yoast_wpseo_meta-robots-adv" ] = "noimageindex,noarchive";
		mockSubscribeListener();
		expect( mockYoastActions.setAdvanced ).toHaveBeenCalledWith( [ "noimageindex", "noarchive" ] );

		// Outbound: Yoast's array should be joined with commas.
		mockYoastState.advanced = [ "nosnippet" ];
		mockSubscribeListener();
		const advCall = mockEditEntityRecord.mock.calls.find(
			( call ) => call[ 3 ].meta && call[ 3 ].meta[ "_yoast_wpseo_meta-robots-adv" ] !== undefined
		);
		expect( advCall ).toBeDefined();
		expect( advCall[ 3 ].meta[ "_yoast_wpseo_meta-robots-adv" ] ).toBe( "nosnippet" );

		// Empty string inbound should clear to an empty array, not a [""] array.
		mockMetaState[ "_yoast_wpseo_meta-robots-adv" ] = "";
		mockSubscribeListener();
		expect( mockYoastActions.setAdvanced ).toHaveBeenLastCalledWith( [] );
	} );

	it( "translates cornerstone string values to and from the boolean the Yoast action expects", () => {
		initRtcMetaSync();
		mockSubscribeListener();

		// Inbound: '1' should become true.
		mockMetaState[ "_yoast_wpseo_is_cornerstone" ] = "1";
		mockSubscribeListener();
		expect( mockYoastActions.setCornerstoneContent ).toHaveBeenCalledWith( true );

		// Outbound: Yoast reports true → meta should carry "1".
		mockYoastState.isCornerstone = true;
		mockSubscribeListener();
		const outboundCalls = mockEditEntityRecord.mock.calls.filter(
			( call ) => call[ 3 ].meta && "_yoast_wpseo_is_cornerstone" in call[ 3 ].meta
		);
		// The first call (if any) comes from the inbound echo guard allowing it through.
		// What we care about is: if an outbound write fires, it carries "1" not true.
		for ( const call of outboundCalls ) {
			expect( call[ 3 ].meta[ "_yoast_wpseo_is_cornerstone" ] ).toBe( "1" );
		}
	} );

	it( "mirrors all of the tracked advanced, schema and social keys inbound", () => {
		installHiddenField( "meta-robots-noindex", "" );
		installHiddenField( "canonical", "" );
		installHiddenField( "schema_page_type", "" );
		installHiddenField( "opengraph-title", "" );
		initRtcMetaSync();
		mockSubscribeListener();

		mockMetaState = {
			"_yoast_wpseo_meta-robots-noindex": "2",
			"_yoast_wpseo_canonical": "https://example.test/canonical",
			"_yoast_wpseo_schema_page_type": "ItemPage",
			"_yoast_wpseo_opengraph-title": "Shared OG title",
		};
		mockSubscribeListener();

		expect( mockYoastActions.setNoIndex ).toHaveBeenCalledWith( "2" );
		expect( mockYoastActions.setCanonical ).toHaveBeenCalledWith( "https://example.test/canonical" );
		expect( mockYoastActions.setPageType ).toHaveBeenCalledWith( "ItemPage" );
		expect( mockYoastActions.setFacebookPreviewTitle ).toHaveBeenCalledWith( "Shared OG title" );
		expect( document.getElementById( "yoast_wpseo_meta-robots-noindex" ).value ).toBe( "2" );
		expect( document.getElementById( "yoast_wpseo_canonical" ).value ).toBe( "https://example.test/canonical" );
		expect( document.getElementById( "yoast_wpseo_schema_page_type" ).value ).toBe( "ItemPage" );
		expect( document.getElementById( "yoast_wpseo_opengraph-title" ).value ).toBe( "Shared OG title" );
	} );

	it( "dispatches an input event on the hidden field so classic-metabox listeners re-run", () => {
		const input = installHiddenField( "focuskw", "" );
		const handler = jest.fn();
		input.addEventListener( "input", handler );

		initRtcMetaSync();
		mockSubscribeListener();
		mockMetaState[ "_yoast_wpseo_focuskw" ] = "reactive";
		mockSubscribeListener();

		expect( handler ).toHaveBeenCalledTimes( 1 );
	} );

	it( "survives a Yoast action throwing without leaving the reentry guard stuck", () => {
		mockYoastActions.setFocusKeyword.mockImplementationOnce( () => {
			throw new Error( "boom" );
		} );
		initRtcMetaSync();
		mockSubscribeListener();

		mockMetaState[ "_yoast_wpseo_focuskw" ] = "first";
		mockSubscribeListener();
		expect( mockYoastActions.setFocusKeyword ).toHaveBeenCalledWith( "first" );

		// A subsequent edit should not be dropped by a stuck guard.
		mockMetaState[ "_yoast_wpseo_focuskw" ] = "second";
		mockSubscribeListener();
		expect( mockYoastActions.setFocusKeyword ).toHaveBeenCalledWith( "second" );
	} );
} );
