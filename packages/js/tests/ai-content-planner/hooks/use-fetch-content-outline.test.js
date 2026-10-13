import { renderHook, act } from "@testing-library/react";
import { useSelect, useDispatch } from "@wordpress/data";
import { useFetchContentOutline } from "../../../src/ai-content-planner/hooks/use-fetch-content-outline";
import { FEATURE_MODAL_STATUS } from "../../../src/ai-content-planner/constants";
import { removesLocaleVariantSuffixes } from "../../../src/shared-admin/helpers";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
} ) );

jest.mock( "../../../src/shared-admin/helpers", () => ( {
	removesLocaleVariantSuffixes: jest.fn( ( locale ) => locale ),
} ) );

const fetchContentOutline = jest.fn();
const restoreContentOutlineFromCache = jest.fn();
const setFeatureModalStatus = jest.fn();

const mockSuggestion = { id: "suggestion-1", title: "Test Suggestion" };
const defaultStoreValues = {
	endpoint: "https://example.com/outline",
	postType: "post",
	contentLocale: "en_US",
	editorApiValue: "classic",
	recentContent: [],
	selectContentOutlineCache: jest.fn( () => null ),
};

/**
 * Sets up useSelect to return the given store values.
 *
 * @param {Object} overrides Store values to override.
 */
const setupUseSelect = ( overrides = {} ) => {
	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		const values = { ...defaultStoreValues, ...overrides };
		if ( storeName === "yoast-seo/content-planner" ) {
			return {
				selectContentOutlineEndpoint: () => values.endpoint,
				selectRecentContent: () => values.recentContent,
				selectContentOutlineCache: values.selectContentOutlineCache,
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return {
				getPostType: () => values.postType,
				getContentLocale: () => values.contentLocale,
				getEditorTypeApiValue: () => values.editorApiValue,
			};
		}
	} ) );
};

describe( "useFetchContentOutline", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		setupUseSelect();
		useDispatch.mockReturnValue( { fetchContentOutline, restoreContentOutlineFromCache, setFeatureModalStatus } );
	} );

	describe( "cache hit", () => {
		it( "restores from cache and sets contentOutline modal status when cache exists", () => {
			const cachedOutline = [ { heading: "Cached Section" } ];
			setupUseSelect( {
				selectContentOutlineCache: jest.fn( () => cachedOutline ),
			} );

			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( restoreContentOutlineFromCache ).toHaveBeenCalledWith( {
				suggestion: mockSuggestion,
				outline: cachedOutline,
			} );
			expect( setFeatureModalStatus ).toHaveBeenCalledWith( FEATURE_MODAL_STATUS.contentOutline );
		} );

		it( "does not call fetchContentOutline when cache exists", () => {
			setupUseSelect( {
				selectContentOutlineCache: jest.fn( () => [ { heading: "Cached" } ] ),
			} );

			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( fetchContentOutline ).not.toHaveBeenCalled();
		} );

		it( "looks up the cache using the suggestion id", () => {
			const selectContentOutlineCache = jest.fn( () => null );
			setupUseSelect( { selectContentOutlineCache } );

			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( selectContentOutlineCache ).toHaveBeenCalledWith( mockSuggestion.id );
		} );
	} );

	describe( "cache miss", () => {
		it( "calls fetchContentOutline with endpoint, postType, editor, and suggestion", () => {
			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( fetchContentOutline ).toHaveBeenCalledWith( expect.objectContaining( {
				endpoint: defaultStoreValues.endpoint,
				postType: defaultStoreValues.postType,
				editor: defaultStoreValues.editorApiValue,
				suggestion: mockSuggestion,
			} ) );
		} );

		it( "does not call restoreContentOutlineFromCache when there is no cache", () => {
			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( restoreContentOutlineFromCache ).not.toHaveBeenCalled();
		} );

		it( "does not call setFeatureModalStatus when there is no cache", () => {
			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( setFeatureModalStatus ).not.toHaveBeenCalled();
		} );

		it( "passes recentContent from the store to fetchContentOutline", () => {
			const recentContent = [ { title: "My Post", description: "A description." } ];
			setupUseSelect( { recentContent } );

			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( fetchContentOutline ).toHaveBeenCalledWith( expect.objectContaining( {
				recentContent,
			} ) );
		} );
	} );

	describe( "language locale transformation", () => {
		it( "replaces underscores with hyphens in the language param", () => {
			removesLocaleVariantSuffixes.mockImplementation( ( locale ) => locale );
			setupUseSelect( { contentLocale: "en_US" } );

			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( fetchContentOutline ).toHaveBeenCalledWith( expect.objectContaining( {
				language: "en-US",
			} ) );
		} );

		it( "passes the locale through removesLocaleVariantSuffixes before building the language param", () => {
			removesLocaleVariantSuffixes.mockImplementation( () => "en" );
			setupUseSelect( { contentLocale: "en_US_variant" } );

			const { result } = renderHook( () => useFetchContentOutline() );

			act( () => {
				result.current( mockSuggestion );
			} );

			expect( removesLocaleVariantSuffixes ).toHaveBeenCalledWith( "en_US_variant" );
			expect( fetchContentOutline ).toHaveBeenCalledWith( expect.objectContaining( {
				language: "en",
			} ) );
		} );
	} );
} );
