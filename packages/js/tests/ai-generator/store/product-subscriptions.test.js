import {
	productSubscriptionsReducer,
	getInitialProductSubscriptionsState,
	PRODUCT_SUBSCRIPTIONS_NAME,
	productSubscriptionsSelectors,
} from "../../../src/ai-generator/store/product-subscriptions.js";

describe( "productSubscriptionsReducer", () => {
	it( "should return the initial state", () => {
		expect( productSubscriptionsReducer( undefined, {} ) ).toEqual( getInitialProductSubscriptionsState() );
	} );

	// If you add actions in the future, you can test them here.
} );

describe( "productSubscriptionsSelectors", () => {
	const mockStateWithValidSubscriptions = {
		[ PRODUCT_SUBSCRIPTIONS_NAME ]: {
			premiumSubscription: true,
			wooCommerceSubscription: true,
		},
	};
	const mockStateWithoutValidSubscriptions = {
		[ PRODUCT_SUBSCRIPTIONS_NAME ]: {
			premiumSubscription: false,
			wooCommerceSubscription: false,
		},
	};

	it( "should select an object with Yoast SEO Premium and Yoast WooCommerce SEO add-on subscription validity", () => {
		expect( productSubscriptionsSelectors.selectProductSubscriptions( mockStateWithValidSubscriptions ) ).toEqual(
			{ premiumSubscription: true, wooCommerceSubscription: true }
		);
	} );

	it( "should select true if there is a valid Yoast SEO Premium subscription", () => {
		expect( productSubscriptionsSelectors.selectPremiumSubscription( mockStateWithValidSubscriptions ) ).toBe( true );
	} );

	it( "should select true if there is a valid Yoast WooCommerce SEO subscription", () => {
		expect( productSubscriptionsSelectors.selectWooCommerceSubscription( mockStateWithValidSubscriptions ) ).toBe( true );
	} );

	it( "should select false if there is no valid Yoast SEO Premium subscription", () => {
		expect( productSubscriptionsSelectors.selectPremiumSubscription( mockStateWithoutValidSubscriptions ) ).toBe( false );
	} );

	it( "should select false if there is no valid Yoast WooCommerce SEO subscription", () => {
		expect( productSubscriptionsSelectors.selectWooCommerceSubscription( mockStateWithoutValidSubscriptions ) ).toBe( false );
	} );

	it( "should return false if the state does not have the productSubscriptions property", () => {
		const incompleteState = {};
		expect( productSubscriptionsSelectors.selectProductSubscriptions( incompleteState ) ).toEqual(
			{ premiumSubscription: false, wooCommerceSubscription: false }
		);
	} );
} );

