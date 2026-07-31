import { renderHook, act } from "@testing-library/react";
import { useSelect, useDispatch } from "@wordpress/data";
import { useFetchContentSuggestions } from "../../../src/ai-content-planner/hooks/use-fetch-content-suggestions";
import { FEATURE_MODAL_STATUS } from "../../../src/ai-content-planner/constants";
import { ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";
import { removesLocaleVariantSuffixes } from "../../../src/shared-admin/helpers";

jest.mock( "@wordpress/data", () => ( {
	useSelect: jest.fn(),
	useDispatch: jest.fn(),
} ) );

jest.mock( "../../../src/shared-admin/helpers", () => ( {
	removesLocaleVariantSuffixes: jest.fn( ( locale ) => locale ),
} ) );

const fetchContentPlannerSuggestions = jest.fn();
const setFeatureModalStatus = jest.fn();
const setContentSuggestionsStatus = jest.fn();
const setSuggestionsError = jest.fn();
const fetchUsageCount = jest.fn();
const addUsageCount = jest.fn();

const defaultStoreValues = {
	endpoint: "https://example.com/suggestions",
	postType: "post",
	contentLocale: "en_US",
	editorApiValue: "classic",
	usageCountEndpoint: "https://example.com/usage",
	isUsageCountLimitReached: false,
	hasValidPremiumSubscription: false,
	isPremium: false,
};

/**
 * Sets up useSelect to return the given store values.
 *
 * @param {Object} overrides Store values to override.
 */
const setupUseSelect = ( overrides = {} ) => {
	const values = { ...defaultStoreValues, ...overrides };
	useSelect.mockImplementation( ( selector ) => selector( ( storeName ) => {
		if ( storeName === "yoast-seo/content-planner" ) {
			return {
				selectContentSuggestionsEndpoint: () => values.endpoint,
			};
		}
		if ( storeName === "yoast-seo/editor" ) {
			return {
				getPostType: () => values.postType,
				getContentLocale: () => values.contentLocale,
				getEditorTypeApiValue: () => values.editorApiValue,
				getIsPremium: () => values.isPremium,
			};
		}
		if ( storeName === "yoast-seo/ai-generator" ) {
			return {
				selectUsageCountEndpoint: () => values.usageCountEndpoint,
				isUsageCountLimitReached: () => values.isUsageCountLimitReached,
				selectPremiumSubscription: () => values.hasValidPremiumSubscription,
			};
		}
	} ) );
};

/**
 * Sets up useDispatch to return the correct mocks per store.
 */
const setupUseDispatch = () => {
	useDispatch.mockImplementation( ( storeName ) => {
		if ( storeName === "yoast-seo/ai-generator" ) {
			return { fetchUsageCount, addUsageCount };
		}
		return { fetchContentPlannerSuggestions, setFeatureModalStatus, setContentSuggestionsStatus, setSuggestionsError };
	} );
};

describe( "useFetchContentSuggestions", () => {
	beforeEach( () => {
		jest.clearAllMocks();
		setupUseSelect();
		setupUseDispatch();
		fetchUsageCount.mockResolvedValue( { payload: { count: 1, limit: 100 } } );
	} );

	describe( "premium installed but subscription invalid (pre-fetch check)", () => {
		it( "sets featureModalStatus to contentSuggestions and calls setSuggestionsError when premium is installed but subscription is invalid", async() => {
			setupUseSelect( { isPremium: true, hasValidPremiumSubscription: false } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setFeatureModalStatus ).toHaveBeenCalledWith( FEATURE_MODAL_STATUS.contentSuggestions );
			expect( setSuggestionsError ).toHaveBeenCalledWith( {
				errorCode: 402,
				errorIdentifier: "PAYMENT_REQUIRED",
				missingLicenses: [ "Yoast SEO Premium" ],
			} );
		} );

		it( "does not fetch usage count when premium is installed but subscription is invalid", async() => {
			setupUseSelect( { isPremium: true, hasValidPremiumSubscription: false } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchUsageCount ).not.toHaveBeenCalled();
		} );
	} );

	describe( "usage limit already reached (pre-fetch check)", () => {
		it( "sets featureModalStatus to idle and returns early when limit is reached and no premium", async() => {
			setupUseSelect( { isUsageCountLimitReached: true, hasValidPremiumSubscription: false } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setFeatureModalStatus ).toHaveBeenCalledWith( FEATURE_MODAL_STATUS.idle );
			expect( fetchUsageCount ).not.toHaveBeenCalled();
		} );

		it( "does not set contentSuggestionsStatus when limit is already reached", async() => {
			setupUseSelect( { isUsageCountLimitReached: true, hasValidPremiumSubscription: false } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setContentSuggestionsStatus ).not.toHaveBeenCalled();
		} );

		it( "does not return early when limit is reached but user has a premium subscription", async() => {
			setupUseSelect( { isUsageCountLimitReached: true, hasValidPremiumSubscription: true } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchUsageCount ).toHaveBeenCalledTimes( 1 );
		} );

		it( "proceeds normally when limit is not reached", async() => {
			setupUseSelect( { isUsageCountLimitReached: false } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchUsageCount ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "modal and loading status setup", () => {
		it( "sets featureModalStatus to contentSuggestions before fetching", async() => {
			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setFeatureModalStatus ).toHaveBeenCalledWith( FEATURE_MODAL_STATUS.contentSuggestions );
		} );

		it( "sets contentSuggestionsStatus to loading before fetching", async() => {
			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setContentSuggestionsStatus ).toHaveBeenCalledWith( ASYNC_ACTION_STATUS.loading );
		} );
	} );

	describe( "sparks limit reached after fetching usage count", () => {
		it( "sets featureModalStatus to idle when count >= limit and no premium", async() => {
			fetchUsageCount.mockResolvedValue( { payload: { count: 10, limit: 10 } } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setFeatureModalStatus ).toHaveBeenLastCalledWith( FEATURE_MODAL_STATUS.idle );
			expect( fetchContentPlannerSuggestions ).not.toHaveBeenCalled();
		} );

		it( "sets contentSuggestionsStatus to idle when count >= limit and no premium", async() => {
			fetchUsageCount.mockResolvedValue( { payload: { count: 10, limit: 10 } } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setContentSuggestionsStatus ).toHaveBeenCalledWith( ASYNC_ACTION_STATUS.idle );
		} );

		it( "sets featureModalStatus to idle on 429 USAGE_LIMIT_REACHED error and no premium", async() => {
			fetchUsageCount.mockResolvedValue( {
				payload: { errorCode: 429, errorIdentifier: "USAGE_LIMIT_REACHED", count: 0, limit: 10 },
			} );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( setFeatureModalStatus ).toHaveBeenLastCalledWith( FEATURE_MODAL_STATUS.idle );
			expect( setContentSuggestionsStatus ).toHaveBeenCalledWith( ASYNC_ACTION_STATUS.idle );
			expect( fetchContentPlannerSuggestions ).not.toHaveBeenCalled();
		} );

		it( "does not call addUsageCount when sparks limit is reached", async() => {
			fetchUsageCount.mockResolvedValue( { payload: { count: 10, limit: 10 } } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( addUsageCount ).not.toHaveBeenCalled();
		} );

		it( "proceeds to fetch suggestions when count >= limit but user has premium", async() => {
			fetchUsageCount.mockResolvedValue( { payload: { count: 10, limit: 10 } } );
			setupUseSelect( { hasValidPremiumSubscription: true } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchContentPlannerSuggestions ).toHaveBeenCalledTimes( 1 );
		} );
	} );

	describe( "successful fetch", () => {
		it( "calls fetchContentPlannerSuggestions with endpoint, postType, language, and editor", async() => {
			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchContentPlannerSuggestions ).toHaveBeenCalledWith( {
				endpoint: defaultStoreValues.endpoint,
				postType: defaultStoreValues.postType,
				language: "en-US",
				editor: defaultStoreValues.editorApiValue,
			} );
		} );

		it( "calls addUsageCount after fetching suggestions", async() => {
			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( addUsageCount ).toHaveBeenCalledTimes( 1 );
		} );

		it( "fetches usage count with the correct endpoint and isWooProductEntity false", async() => {
			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchUsageCount ).toHaveBeenCalledWith( {
				endpoint: defaultStoreValues.usageCountEndpoint,
				isWooProductEntity: false,
			} );
		} );
	} );

	describe( "language locale transformation", () => {
		it( "replaces underscores with hyphens in the language param", async() => {
			removesLocaleVariantSuffixes.mockImplementation( ( locale ) => locale );
			setupUseSelect( { contentLocale: "nl_NL" } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( fetchContentPlannerSuggestions ).toHaveBeenCalledWith( expect.objectContaining( {
				language: "nl-NL",
			} ) );
		} );

		it( "passes the locale through removesLocaleVariantSuffixes before building the language param", async() => {
			removesLocaleVariantSuffixes.mockImplementation( () => "de" );
			setupUseSelect( { contentLocale: "de_DE_formal" } );

			const { result } = renderHook( () => useFetchContentSuggestions() );

			await act( async() => {
				await result.current();
			} );

			expect( removesLocaleVariantSuffixes ).toHaveBeenCalledWith( "de_DE_formal" );
			expect( fetchContentPlannerSuggestions ).toHaveBeenCalledWith( expect.objectContaining( {
				language: "de",
			} ) );
		} );
	} );
} );
