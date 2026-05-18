import { beforeEach, describe, expect, it } from "@jest/globals";
import { setBannerRenderedInput, setBannerDismissedInput } from "../../../src/ai-content-planner/helpers/fields";
import {
	BANNER_NAME,
	bannerActions,
	bannerControls,
	bannerReducer,
	bannerSelectors,
	dismissBannerPermanently,
	getInitialBannerState,
} from "../../../src/ai-content-planner/store/banner";

jest.mock( "../../../src/ai-content-planner/helpers/fields", () => ( {
	setBannerRenderedInput: jest.fn(),
	setBannerDismissedInput: jest.fn(),
} ) );

jest.mock( "@wordpress/api-fetch", () => jest.fn() );

import apiFetch from "@wordpress/api-fetch";

describe( "banner store", () => {
	beforeEach( () => {
		setBannerRenderedInput.mockClear();
		setBannerDismissedInput.mockClear();
		apiFetch.mockClear();
	} );

	describe( "getInitialBannerState", () => {
		it( "should return the initial state", () => {
			expect( getInitialBannerState() ).toEqual( {
				isBannerDismissed: false,
				isBannerRendered: false,
				isBannerPermanentlyDismissed: false,
				bannerPermanentDismissalEndpoint: "",
			} );
		} );
	} );

	describe( "reducer", () => {
		it( "should return the initial state for an unknown action", () => {
			expect( bannerReducer( undefined, { type: "@@INIT" } ) ).toEqual( {
				isBannerDismissed: false,
				isBannerRendered: false,
				isBannerPermanentlyDismissed: false,
				bannerPermanentDismissalEndpoint: "",
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

		it( "should set isBannerPermanentlyDismissed to true on setBannerPermanentlyDismissed", () => {
			const result = bannerReducer( getInitialBannerState(), { type: `${ BANNER_NAME }/setBannerPermanentlyDismissed` } );
			expect( result.isBannerPermanentlyDismissed ).toBe( true );
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

		it( "setBannerPermanentlyDismissed returns the slice action without calling DOM helpers", () => {
			const action = bannerActions.setBannerPermanentlyDismissed();
			expect( action.type ).toBe( `${ BANNER_NAME }/setBannerPermanentlyDismissed` );
			expect( setBannerRenderedInput ).not.toHaveBeenCalled();
			expect( setBannerDismissedInput ).not.toHaveBeenCalled();
		} );
	} );

	describe( "dismissBannerPermanently generator", () => {
		it( "should return early without yielding when endpoint is falsy", () => {
			const generator = dismissBannerPermanently( "" );
			const result = generator.next();
			expect( result.done ).toBe( true );
			expect( result.value ).toBeUndefined();
		} );

		it( "should yield the setBannerPermanentlyDismissed action then the control action when endpoint is provided", () => {
			const endpoint = "yoast/v1/ai_content_planner/dismiss_banner";
			const generator = dismissBannerPermanently( endpoint );

			// First yield: slice action to update state.
			const firstResult = generator.next();
			expect( firstResult.value.type ).toBe( `${ BANNER_NAME }/setBannerPermanentlyDismissed` );
			expect( firstResult.done ).toBe( false );

			// Second yield: control action to fire the REST call.
			const secondResult = generator.next();
			expect( secondResult.value ).toEqual( { type: "dismissBannerPermanently", endpoint } );
			expect( secondResult.done ).toBe( false );

			// Generator completes.
			expect( generator.next().done ).toBe( true );
		} );
	} );

	describe( "controls", () => {
		it( "should call apiFetch with POST method and is_dismissed: true", async() => {
			apiFetch.mockResolvedValue( undefined );
			const endpoint = "yoast/v1/ai_content_planner/dismiss_banner";

			await bannerControls.dismissBannerPermanently( { endpoint } );

			expect( apiFetch ).toHaveBeenCalledWith( expect.objectContaining( {
				path: endpoint,
				method: "POST",
				// eslint-disable-next-line camelcase
				data: { is_dismissed: true },
			} ) );
		} );

		it( "should swallow apiFetch errors silently", async() => {
			apiFetch.mockRejectedValue( new Error( "Network error" ) );

			await expect(
				bannerControls.dismissBannerPermanently( { endpoint: "yoast/v1/test" } )
			).resolves.toBeUndefined();
		} );
	} );

	describe( "selectors", () => {
		const fullState = {
			[ BANNER_NAME ]: {
				isBannerDismissed: true,
				isBannerRendered: true,
				isBannerPermanentlyDismissed: true,
				bannerPermanentDismissalEndpoint: "yoast/v1/ai_content_planner/dismiss_banner",
			},
		};

		it( "should return isBannerDismissed from state", () => {
			expect( bannerSelectors.selectIsBannerDismissed( fullState ) ).toBe( true );
		} );

		it( "should return the default isBannerDismissed when state is missing", () => {
			expect( bannerSelectors.selectIsBannerDismissed( {} ) ).toBe( false );
		} );

		it( "should return isBannerRendered from state", () => {
			expect( bannerSelectors.selectIsBannerRendered( fullState ) ).toBe( true );
		} );

		it( "should return the default isBannerRendered when state is missing", () => {
			expect( bannerSelectors.selectIsBannerRendered( {} ) ).toBe( false );
		} );

		it( "should return isBannerPermanentlyDismissed from state", () => {
			expect( bannerSelectors.selectIsBannerPermanentlyDismissed( fullState ) ).toBe( true );
		} );

		it( "should return the default isBannerPermanentlyDismissed when state is missing", () => {
			expect( bannerSelectors.selectIsBannerPermanentlyDismissed( {} ) ).toBe( false );
		} );

		it( "should return bannerPermanentDismissalEndpoint from state", () => {
			expect( bannerSelectors.selectBannerPermanentDismissalEndpoint( fullState ) )
				.toBe( "yoast/v1/ai_content_planner/dismiss_banner" );
		} );

		it( "should return the default bannerPermanentDismissalEndpoint when state is missing", () => {
			expect( bannerSelectors.selectBannerPermanentDismissalEndpoint( {} ) ).toBe( "" );
		} );
	} );
} );
