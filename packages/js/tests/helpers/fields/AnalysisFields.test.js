import AnalysisFields from "../../../src/helpers/fields/AnalysisFields";
import { mockWindow, createInputElement } from "../../test-utils";
import { metaKeyFocusKw, metaKeyLinkdex } from "../../../src/shared-admin/constants";

const mockGetEditedPostAttribute = jest.fn();
const mockCurrentPostType = jest.fn();
const mockCurrentPostId = jest.fn().mockReturnValue( 1 );
const mockGetPostType = jest.fn();
const mockEditPost = jest.fn();
const mockEditEntityRecord = jest.fn();
const mockCapturedSubscribers = [];
let capturedMiddleware = null;

jest.mock( "@wordpress/api-fetch", () => {
	const mock = jest.fn();
	mock.use = jest.fn( ( middleware ) => {
		capturedMiddleware = middleware;
	} );
	return mock;
} );

jest.mock( "@wordpress/data", () => ( {
	select: ( store ) => {
		if ( store === "core/editor" ) {
			return {
				getCurrentPostType: mockCurrentPostType,
				getCurrentPostId: mockCurrentPostId,
				getEditedPostAttribute: mockGetEditedPostAttribute,
			};
		}
		if ( store === "core" ) {
			return { getPostType: mockGetPostType };
		}
		return {};
	},
	dispatch: ( store ) => {
		if ( store === "core/editor" ) {
			return { editPost: mockEditPost };
		}
		if ( store === "core" ) {
			return { editEntityRecord: mockEditEntityRecord };
		}
		return {};
	},
	subscribe: jest.fn( ( fn ) => {
		mockCapturedSubscribers.push( fn );
		return () => {
			const index = mockCapturedSubscribers.indexOf( fn );
			if ( index > -1 ) {
				mockCapturedSubscribers.splice( index, 1 );
			}
		};
	} ),
} ) );

describe( "keyphrase", () => {
	const id = {
		terms: "hidden_wpseo_focuskw",
		posts: "yoast_wpseo_focuskw",
	};

	describe( "get keyphraseElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.keyphraseElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get keyphrase", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.keyphrase ).toBe( "" );
		} );

		it( "gets the keyphrase", () => {
			const inputElement = createInputElement( id.terms, "foo" );

			expect( AnalysisFields.keyphrase ).toBe( "foo" );

			inputElement.remove();
		} );
	} );

	describe( "set keyphrase", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.keyphrase = "foo";
			expect( AnalysisFields.keyphraseElement ).toBeNull();
		} );

		it( "sets the keyphrase", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.keyphrase = "foo";
			expect( AnalysisFields.keyphrase ).toBe( "foo" );

			inputElement.remove();
		} );
	} );
} );

describe( "isCornerstone", () => {
	const id = {
		terms: "hidden_wpseo_is_cornerstone",
		posts: "yoast_wpseo_is_cornerstone",
	};

	describe( "get isCornerstoneElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.isCornerstoneElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get isCornerstone", () => {
		it( "returns false when no element is present", () => {
			expect( AnalysisFields.isCornerstone ).toBe( false );
		} );

		it( "gets isCornerstone", () => {
			const inputElement = createInputElement( id.terms, "1" );

			expect( AnalysisFields.isCornerstone ).toBe( true );

			inputElement.remove();
		} );
	} );

	describe( "set isCornerstone", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.isCornerstone = true;
			expect( AnalysisFields.isCornerstoneElement ).toBeNull();
		} );

		test.each( [
			// Happy path with boolean.
			[ true, "1", true ],
			[ false, "0", false ],
			// Truthy with different types.
			[ true, "1", "string" ],
			[ true, "1", {} ],
			[ true, "1", [] ],
			[ true, "1", Object ],
			// Falsy with different types.
			[ false, "0", "" ],
			[ false, "0", null ],
			[ false, "0", undefined ],
		] )( "should return %s with the value %s when setting %s", ( expected, expectedValue, input ) => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.isCornerstone = input;
			expect( AnalysisFields.isCornerstone ).toBe( expected );
			expect( AnalysisFields.isCornerstoneElement?.value ).toBe( expectedValue );

			inputElement.remove();
		} );
	} );
} );

describe( "seoScore", () => {
	const id = {
		terms: "hidden_wpseo_linkdex",
		posts: "yoast_wpseo_linkdex",
	};

	describe( "get seoScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.seoScoreElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get seoScore", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.seoScore ).toBe( "" );
		} );

		it( "gets the seoScore", () => {
			const inputElement = createInputElement( id.terms, "9" );

			expect( AnalysisFields.seoScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );

	describe( "set seoScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.seoScore = "9";
			expect( AnalysisFields.seoScoreElement ).toBeNull();
		} );

		it( "sets the seoScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.seoScore = "9";
			expect( AnalysisFields.seoScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );

describe( "readabilityScore", () => {
	const id = {
		terms: "hidden_wpseo_content_score",
		posts: "yoast_wpseo_content_score",
	};

	describe( "get readabilityScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.readabilityScoreElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get readabilityScore", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.readabilityScore ).toBe( "" );
		} );

		it( "gets the readabilityScore", () => {
			const inputElement = createInputElement( id.terms, "9" );

			expect( AnalysisFields.readabilityScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );

	describe( "set readabilityScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.readabilityScore = "9";
			expect( AnalysisFields.readabilityScoreElement ).toBeNull();
		} );

		it( "sets the readabilityScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.readabilityScore = "9";
			expect( AnalysisFields.readabilityScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );

describe( "inclusiveLanguageScore", () => {
	const id = {
		terms: "hidden_wpseo_inclusive_language_score",
		posts: "yoast_wpseo_inclusive_language_score",
	};

	describe( "get inclusiveLanguageScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBeNull();
		} );

		it( "gets the element for non-posts by default", () => {
			const inputElement = createInputElement( id.terms );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createInputElement( id.terms );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: false } } );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "get inclusiveLanguageScore", () => {
		it( "returns an empty string when no element is present", () => {
			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "" );
		} );

		it( "gets the inclusiveLanguageScore", () => {
			const inputElement = createInputElement( id.terms, "9" );

			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );

	describe( "set inclusiveLanguageScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.inclusiveLanguageScore = "9";
			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBeNull();
		} );

		it( "sets the inclusiveLanguageScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.inclusiveLanguageScore = "9";
			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );

describe( "seoTitleScore", () => {
	const id = {
		terms: "hidden_wpseo_seo_title_score",
		posts: "yoast_wpseo_seo_title_score",
	};

	describe( "get seoTitleScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.seoTitleScoreElement ).toBeNull();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.seoTitleScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "set seoTitleScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.seoTitleScore = "63";
			expect( AnalysisFields.seoTitleScoreElement ).toBeNull();
		} );

		it( "sets the seoTitleScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.seoTitleScore = "63";
			expect( AnalysisFields.seoTitleScore ).toBe( "63" );

			inputElement.remove();
		} );
	} );
} );

describe( "metaDescriptionScore", () => {
	const id = {
		terms: "hidden_wpseo_meta_description_score",
		posts: "yoast_wpseo_meta_description_score",
	};

	describe( "get metaDescriptionScoreElement", () => {
		it( "returns null when no element is present", () => {
			expect( AnalysisFields.metaDescriptionScoreElement ).toBeNull();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createInputElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.metaDescriptionScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );
	} );

	describe( "set metaDescriptionScore", () => {
		it( "does nothing when no element is present", () => {
			AnalysisFields.metaDescriptionScore = "85";
			expect( AnalysisFields.metaDescriptionScoreElement ).toBeNull();
		} );

		it( "sets the metaDescriptionScore", () => {
			const inputElement = createInputElement( id.terms );

			AnalysisFields.metaDescriptionScore = "85";
			expect( AnalysisFields.metaDescriptionScore ).toBe( "85" );

			inputElement.remove();
		} );
	} );
} );

describe( "pending writes (REST meta mode)", () => {
	beforeEach( () => {
		// Flush leftover module state (pendingWrites from writeOrQueue) by simulating the editor becoming ready.
		mockCurrentPostType.mockReturnValue( "post" );
		[ ...mockCapturedSubscribers ].forEach( fn => fn() );
		mockCapturedSubscribers.length = 0;

		window.wpseoScriptData = { isPost: true, disableMetaboxInBlockEditor: true };
		mockCurrentPostType.mockReturnValue( null );
		mockGetEditedPostAttribute.mockReturnValue( {} );
		mockEditPost.mockClear();
		mockEditEntityRecord.mockClear();
	} );

	afterEach( () => {
		delete window.wpseoScriptData;
	} );

	it( "buffers a score write without dispatching to core/editor", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyLinkdex ]: "47" } );
		AnalysisFields.seoScore = "50";

		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
		expect( mockEditPost ).not.toHaveBeenCalled();
	} );

	it( "skips buffering when the score matches the committed value", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyLinkdex ]: "50" } );
		AnalysisFields.seoScore = "50";

		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
		expect( mockEditPost ).not.toHaveBeenCalled();
	} );

	it( "treats a committed empty string as equivalent to '0' and skips buffering", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyLinkdex ]: "" } );
		// -665 sanitizes to "0"; "" is treated as "0" → skip.
		AnalysisFields.seoScore = "-665";

		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
		expect( mockEditPost ).not.toHaveBeenCalled();
	} );

	it( "clamps a negative score to '0' and buffers it when committed value differs", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyLinkdex ]: "50" } );
		// -665 sanitizes to "0"; "50" ≠ "0" → buffer.
		AnalysisFields.seoScore = "-665";

		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
		expect( mockEditPost ).not.toHaveBeenCalled();
	} );

	it( "flushes user-editable writes via editPost when the editor becomes ready", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyFocusKw ]: "" } );
		AnalysisFields.keyphrase = "test keyword";

		expect( mockEditPost ).not.toHaveBeenCalled();
		expect( mockCapturedSubscribers ).toHaveLength( 1 );

		mockCurrentPostType.mockReturnValue( "post" );
		mockCapturedSubscribers[ 0 ]();

		expect( mockEditPost ).toHaveBeenCalledWith( { meta: { [ metaKeyFocusKw ]: "test keyword" } } );
		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
	} );
} );

describe( "score inject middleware", () => {
	beforeEach( () => {
		// Flush any leftover score buffer from previous tests.
		mockCurrentPostType.mockReturnValue( "post" );
		mockCurrentPostId.mockReturnValue( 1 );
		// eslint-disable-next-line camelcase
		mockGetPostType.mockReturnValue( { rest_base: "posts" } );

		window.wpseoScriptData = { isPost: true, disableMetaboxInBlockEditor: true };
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyLinkdex ]: "47" } );

		// Drain the buffer so each test starts clean.
		if ( capturedMiddleware ) {
			capturedMiddleware( { method: "PUT", path: "/wp/v2/posts/1", data: {} }, jest.fn() );
		}
	} );

	afterEach( () => {
		delete window.wpseoScriptData;
	} );

	it( "injects buffered scores into the save payload", () => {
		AnalysisFields.seoScore = "50";

		const next = jest.fn();
		capturedMiddleware( { method: "PUT", path: "/wp/v2/posts/1", data: { title: "My Post", meta: {} } }, next );

		expect( next ).toHaveBeenCalledWith( {
			method: "PUT",
			path: "/wp/v2/posts/1",
			data: { title: "My Post", meta: { [ metaKeyLinkdex ]: "50" } },
		} );
	} );

	it( "passes the request through unchanged when the buffer is empty", () => {
		const next = jest.fn();
		const options = { method: "PUT", path: "/wp/v2/posts/1", data: {} };
		capturedMiddleware( options, next );

		expect( next ).toHaveBeenCalledWith( options );
	} );

	it( "passes the request through unchanged for GET requests", () => {
		AnalysisFields.seoScore = "50";

		const next = jest.fn();
		const options = { method: "GET", path: "/wp/v2/posts/1" };
		capturedMiddleware( options, next );

		expect( next ).toHaveBeenCalledWith( options );
	} );

	it( "passes the request through unchanged for autosave requests", () => {
		AnalysisFields.seoScore = "50";

		const next = jest.fn();
		const options = { method: "POST", path: "/wp/v2/posts/1/autosaves" };
		capturedMiddleware( options, next );

		expect( next ).toHaveBeenCalledWith( options );
	} );

	it( "passes the request through unchanged when the path does not match the current post", () => {
		AnalysisFields.seoScore = "50";

		const next = jest.fn();
		const options = { method: "PUT", path: "/wp/v2/posts/999" };
		capturedMiddleware( options, next );

		expect( next ).toHaveBeenCalledWith( options );
	} );

	it( "clears the buffer after injecting so a second save does not re-inject stale scores", () => {
		AnalysisFields.seoScore = "50";

		const first = jest.fn();
		capturedMiddleware( { method: "PUT", path: "/wp/v2/posts/1", data: {} }, first );

		const second = jest.fn();
		capturedMiddleware( { method: "PUT", path: "/wp/v2/posts/1", data: {} }, second );

		expect( first ).toHaveBeenCalledWith( expect.objectContaining( { data: expect.objectContaining( { meta: { [ metaKeyLinkdex ]: "50" } } ) } ) );
		expect( second ).toHaveBeenCalledWith( { method: "PUT", path: "/wp/v2/posts/1", data: {} } );
	} );
} );
