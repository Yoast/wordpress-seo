import { describe, expect, it } from "@jest/globals";
import {
	ENDPOINTS_NAME,
	endpointsSelectors,
	getInitialEndpointsState,
} from "../../../src/ai-generator/store/endpoints";

describe( "endpoints store", () => {
	describe( "getInitialEndpointsState", () => {
		it( "should return the initial state with empty strings", () => {
			expect( getInitialEndpointsState() ).toEqual( {
				getSuggestions: "",
				bustSubscriptionCache: "",
			} );
		} );
	} );

	describe( "selectGetSuggestionsEndpoint", () => {
		it( "should return the getSuggestions endpoint from state", () => {
			const state = {
				[ ENDPOINTS_NAME ]: {
					getSuggestions: "yoast/v1/ai_generator/get_suggestions",
					bustSubscriptionCache: "",
				},
			};

			expect( endpointsSelectors.selectGetSuggestionsEndpoint( state ) ).toBe( "yoast/v1/ai_generator/get_suggestions" );
		} );

		it( "should return the default when state is missing", () => {
			expect( endpointsSelectors.selectGetSuggestionsEndpoint( {} ) ).toBe( "" );
		} );
	} );

	describe( "selectBustSubscriptionCacheEndpoint", () => {
		it( "should return the bustSubscriptionCache endpoint from state", () => {
			const state = {
				[ ENDPOINTS_NAME ]: {
					getSuggestions: "",
					bustSubscriptionCache: "yoast/v1/ai_generator/bust_subscription_cache",
				},
			};

			expect( endpointsSelectors.selectBustSubscriptionCacheEndpoint( state ) ).toBe( "yoast/v1/ai_generator/bust_subscription_cache" );
		} );

		it( "should return the default when state is missing", () => {
			expect( endpointsSelectors.selectBustSubscriptionCacheEndpoint( {} ) ).toBe( "" );
		} );
	} );
} );
