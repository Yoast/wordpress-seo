import { describe, expect, it } from "@jest/globals";
import {
	ENDPOINTS_NAME,
	getInitialEndpointsState,
	endpointsSelectors,
} from "../../../src/ai-content-planner/store/endpoints";

describe( "endpoints store", () => {
	describe( "getInitialEndpointsState", () => {
		it( "should return the initial state", () => {
			expect( getInitialEndpointsState() ).toEqual( {
				contentPlanner: "",
			} );
		} );
	} );

	describe( "selectors", () => {
		it( "should return the endpoint from state", () => {
			const state = {
				[ ENDPOINTS_NAME ]: {
					contentPlanner: "yoast/v1/ai_content_planner/get_suggestions",
				},
			};

			expect( endpointsSelectors.selectContentPlannerEndpoint( state ) )
				.toBe( "yoast/v1/ai_content_planner/get_suggestions" );
		} );

		it( "should return an empty string when state is missing", () => {
			expect( endpointsSelectors.selectContentPlannerEndpoint( {} ) ).toBe( "" );
		} );
	} );
} );
