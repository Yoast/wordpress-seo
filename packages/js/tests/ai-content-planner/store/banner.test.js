import { describe, expect, it, beforeEach } from "@jest/globals";
import { setBannerRenderedInput, setBannerDismissedInput } from "../../../src/ai-content-planner/helpers/fields";
import {
	BANNER_NAME,
	bannerActions,
	bannerReducer,
	bannerSelectors,
	getInitialBannerState,
} from "../../../src/ai-content-planner/store/banner";

jest.mock( "../../../src/ai-content-planner/helpers/fields", () => ( {
	setBannerRenderedInput: jest.fn(),
	setBannerDismissedInput: jest.fn(),
} ) );

describe( "banner store", () => {
	beforeEach( () => {
		setBannerRenderedInput.mockClear();
		setBannerDismissedInput.mockClear();
	} );

	describe( "getInitialBannerState", () => {
		it( "should return the initial state", () => {
			expect( getInitialBannerState() ).toEqual( {
				isBannerDismissed: false,
				isBannerRendered: false,
			} );
		} );
	} );

	describe( "reducer", () => {
		it( "should return the initial state for an unknown action", () => {
			expect( bannerReducer( undefined, { type: "@@INIT" } ) ).toEqual( {
				isBannerDismissed: false,
				isBannerRendered: false,
			} );
		} );

		it( "should set isBannerRendered to true on setBannerRendered", () => {
			const result = bannerReducer( getInitialBannerState(), { type: `${ BANNER_NAME }/setBannerRendered` } );
			expect( result.isBannerRendered ).toBe( true );
			expect( result.isBannerDismissed ).toBe( false );
		} );

		it( "should set isBannerDismissed to true on setBannerDismissed", () => {
			const result = bannerReducer( getInitialBannerState(), { type: `${ BANNER_NAME }/setBannerDismissed` } );
			expect( result.isBannerDismissed ).toBe( true );
			expect( result.isBannerRendered ).toBe( false );
		} );
	} );

	describe( "actions", () => {
		it( "setBannerRendered calls setBannerRenderedInput and returns the slice action", () => {
			const action = bannerActions.setBannerRendered();
			expect( setBannerRenderedInput ).toHaveBeenCalledTimes( 1 );
			expect( action.type ).toBe( `${ BANNER_NAME }/setBannerRendered` );
		} );

		it( "setBannerDismissed calls setBannerDismissedInput and returns the slice action", () => {
			const action = bannerActions.setBannerDismissed();
			expect( setBannerDismissedInput ).toHaveBeenCalledTimes( 1 );
			expect( action.type ).toBe( `${ BANNER_NAME }/setBannerDismissed` );
		} );

		it( "setBannerRendered action can be applied to the reducer", () => {
			const action = bannerActions.setBannerRendered();
			const state = bannerReducer( getInitialBannerState(), action );
			expect( state.isBannerRendered ).toBe( true );
		} );

		it( "setBannerDismissed action can be applied to the reducer", () => {
			const action = bannerActions.setBannerDismissed();
			const state = bannerReducer( getInitialBannerState(), action );
			expect( state.isBannerDismissed ).toBe( true );
		} );
	} );

	describe( "selectors", () => {
		it( "should return isBannerDismissed from state", () => {
			const state = { [ BANNER_NAME ]: { isBannerDismissed: true, isBannerRendered: false } };
			expect( bannerSelectors.selectIsBannerDismissed( state ) ).toBe( true );
		} );

		it( "should return the default isBannerDismissed when state is missing", () => {
			expect( bannerSelectors.selectIsBannerDismissed( {} ) ).toBe( false );
		} );

		it( "should return isBannerRendered from state", () => {
			const state = { [ BANNER_NAME ]: { isBannerDismissed: false, isBannerRendered: true } };
			expect( bannerSelectors.selectIsBannerRendered( state ) ).toBe( true );
		} );

		it( "should return the default isBannerRendered when state is missing", () => {
			expect( bannerSelectors.selectIsBannerRendered( {} ) ).toBe( false );
		} );
	} );
} );
