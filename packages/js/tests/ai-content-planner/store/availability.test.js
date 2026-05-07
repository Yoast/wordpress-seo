import { describe, expect, it } from "@jest/globals";
import {
	AVAILABILITY_NAME,
	availabilityReducer,
	availabilitySelectors,
	getInitialAvailabilityState,
} from "../../../src/ai-content-planner/store/availability";

describe( "availability store", () => {
	describe( "getInitialAvailabilityState", () => {
		it( "should return the initial state", () => {
			expect( getInitialAvailabilityState() ).toEqual( {
				minPostsMet: false,
			} );
		} );
	} );

	describe( "reducer", () => {
		it( "should return the initial state for an unknown action", () => {
			expect( availabilityReducer( undefined, { type: "@@INIT" } ) ).toEqual( {
				minPostsMet: false,
			} );
		} );

		it( "should not change state for an unknown action", () => {
			const state = { minPostsMet: true };
			expect( availabilityReducer( state, { type: "UNKNOWN" } ) ).toEqual( state );
		} );
	} );

	describe( "selectors", () => {
		it( "should return minPostsMet from state", () => {
			const state = { [ AVAILABILITY_NAME ]: { minPostsMet: true } };
			expect( availabilitySelectors.selectIsMinPostsMet( state ) ).toBe( true );
		} );

		it( "should return the default minPostsMet when state is missing", () => {
			expect( availabilitySelectors.selectIsMinPostsMet( {} ) ).toBe( false );
		} );

		it( "should return the current minPostsMet value when it is false", () => {
			const state = { [ AVAILABILITY_NAME ]: { minPostsMet: false } };
			expect( availabilitySelectors.selectIsMinPostsMet( state ) ).toBe( false );
		} );
	} );
} );
