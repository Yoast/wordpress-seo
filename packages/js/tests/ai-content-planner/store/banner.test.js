import {
	bannerActions,
	bannerReducer,
	bannerSelectors,
	BANNER_NAME,
	getInitialBannerState,
} from "../../../src/ai-content-planner/store/banner";

describe( "bannerReducer", () => {
	it( "returns the initial state", () => {
		expect( bannerReducer( undefined, {} ) ).toEqual( getInitialBannerState() );
	} );

	it( "handles setBannerRendered", () => {
		const state = bannerReducer( undefined, bannerActions.setBannerRendered() );
		expect( state.isBannerRendered ).toBe( true );
	} );

	it( "handles setBannerDismissed", () => {
		const state = bannerReducer( undefined, bannerActions.setBannerDismissed() );
		expect( state.isBannerDismissed ).toBe( true );
	} );

	it( "does not mutate unrelated state keys", () => {
		const state = bannerReducer( undefined, bannerActions.setBannerRendered() );
		expect( state.isBannerDismissed ).toBe( false );
	} );
} );

describe( "bannerSelectors", () => {
	describe( "getIsBannerDismissed", () => {
		it( "returns false when state is empty", () => {
			expect( bannerSelectors.getIsBannerDismissed( {} ) ).toBe( false );
		} );

		it( "returns the stored value when present", () => {
			const state = { [ BANNER_NAME ]: { isBannerDismissed: true } };
			expect( bannerSelectors.getIsBannerDismissed( state ) ).toBe( true );
		} );
	} );

	describe( "getIsBannerRendered", () => {
		it( "returns false when state is empty", () => {
			expect( bannerSelectors.getIsBannerRendered( {} ) ).toBe( false );
		} );

		it( "returns the stored value when present", () => {
			const state = { [ BANNER_NAME ]: { isBannerRendered: true } };
			expect( bannerSelectors.getIsBannerRendered( state ) ).toBe( true );
		} );
	} );
} );
