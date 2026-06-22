import AnalysisFields from "../../../src/helpers/fields/AnalysisFields";
import { mockWindow, createElement } from "../../test-utils";
import { metaKeyFocusKw, metaKeyLinkdex } from "../../../src/shared-admin/constants";

const mockGetEditedPostAttribute = jest.fn();
const mockCurrentPostType = jest.fn();
const mockCurrentPostId = jest.fn().mockReturnValue( 1 );
const mockEditPost = jest.fn();
const mockEditEntityRecord = jest.fn();
const mockCapturedSubscribers = [];

jest.mock( "@wordpress/data", () => ( {
	select: ( store ) => {
		if ( store === "core/editor" ) {
			return {
				getCurrentPostType: mockCurrentPostType,
				getCurrentPostId: mockCurrentPostId,
				getEditedPostAttribute: mockGetEditedPostAttribute,
			};
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
			const inputElement = createElement( id.terms );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.keyphraseElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createElement( id.terms );
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
			const inputElement = createElement( id.terms );
			inputElement.value = "foo";

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
			const inputElement = createElement( id.terms );

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
			const inputElement = createElement( id.terms );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.isCornerstoneElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createElement( id.terms );
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
			const inputElement = createElement( id.terms );
			inputElement.value = "1";

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
			const inputElement = createElement( id.terms );

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
			const inputElement = createElement( id.terms );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.seoScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createElement( id.terms );
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
			const inputElement = createElement( id.terms );
			inputElement.value = "9";

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
			const inputElement = createElement( id.terms );

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
			const inputElement = createElement( id.terms );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.readabilityScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createElement( id.terms );
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
			const inputElement = createElement( id.terms );
			inputElement.value = "9";

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
			const inputElement = createElement( id.terms );

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
			const inputElement = createElement( id.terms );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
		} );

		it( "gets the element for posts", () => {
			const inputElement = createElement( id.posts );
			const windowSpy = mockWindow( { wpseoScriptData: { isPost: true } } );

			expect( AnalysisFields.inclusiveLanguageScoreElement ).toBe( inputElement );

			inputElement.remove();
			windowSpy.mockRestore();
		} );

		it( "gets the element for non-posts", () => {
			const inputElement = createElement( id.terms );
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
			const inputElement = createElement( id.terms );
			inputElement.value = "9";

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
			const inputElement = createElement( id.terms );

			AnalysisFields.inclusiveLanguageScore = "9";
			expect( AnalysisFields.inclusiveLanguageScore ).toBe( "9" );

			inputElement.remove();
		} );
	} );
} );

describe( "pending writes (REST meta mode)", () => {
	beforeEach( () => {
		// Flush any leftover module state from a previous test by simulating the editor becoming ready.
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

	it( "flushes score writes via writeMetaWithoutUndo when the editor becomes ready", () => {
		AnalysisFields.seoScore = "9";

		expect( mockEditEntityRecord ).not.toHaveBeenCalled();
		expect( mockEditPost ).not.toHaveBeenCalled();
		expect( mockCapturedSubscribers ).toHaveLength( 1 );

		mockCurrentPostType.mockReturnValue( "post" );
		mockCapturedSubscribers[ 0 ]();

		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 1,
			{ meta: { [ metaKeyLinkdex ]: "9" } },
			{ undoIgnore: true }
		);
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

	it( "splits mixed writes into separate editEntityRecord and editPost dispatches on flush", () => {
		mockGetEditedPostAttribute.mockReturnValue( { [ metaKeyFocusKw ]: "" } );
		AnalysisFields.seoScore = "5";
		AnalysisFields.keyphrase = "mixed";

		mockCurrentPostType.mockReturnValue( "post" );
		mockCapturedSubscribers[ 0 ]();

		expect( mockEditEntityRecord ).toHaveBeenCalledWith(
			"postType", "post", 1,
			{ meta: { [ metaKeyLinkdex ]: "5" } },
			{ undoIgnore: true }
		);
		expect( mockEditPost ).toHaveBeenCalledWith( { meta: { [ metaKeyFocusKw ]: "mixed" } } );
	} );
} );
