import { describe, expect, it } from "@jest/globals";
import { ADD_ONS_NAME, addOnsActions, addOnsReducer, addOnsSelectors, getInitialAddOnsState } from "../../../src/plans/store/add-ons";

it( "ADD_ONS_NAME is addOns", () => {
	expect( ADD_ONS_NAME ).toBe( "addOns" );
} );

const ENTITIES = {
	premium: {
		id: "premium",
		isActive: true,
		hasLicense: true,
		ctb: { action: "act-premium", id: "ctb-premium" },
	},
	woo: {
		id: "woo",
		isActive: false,
		hasLicense: false,
		ctb: { action: "act-woo", id: "ctb-woo" },
	},
};

describe( "actions", () => {
	describe( "addManyAddOns", () => {
		it( "should exist", () => {
			expect( addOnsActions.addManyAddOns ).toBeDefined();
		} );

		it( "should return the action", () => {
			expect( addOnsActions.addManyAddOns( [] ) ).toEqual( { type: "addOns/addManyAddOns", payload: [] } );
		} );
	} );
} );

describe( "initial state", () => {
	it( "should have empty entities object and ids array", () => {
		expect( addOnsReducer( undefined, { type: "" } ) ).toEqual( { entities: {}, ids: [] } );
	} );
} );

describe( "reducer", () => {
	describe( "addManyAddOns", () => {
		it( "should add the add-ons", () => {
			const state = getInitialAddOnsState();
			const newState = addOnsReducer( state, addOnsActions.addManyAddOns( ENTITIES ) );
			expect( newState ).toEqual( {
				entities: { premium: ENTITIES.premium, woo: ENTITIES.woo },
				ids: Object.values( ENTITIES ).map( ( entity ) => entity.id ),
			} );
		} );

		it( "should ignore unknown add-ons", () => {
			const state = getInitialAddOnsState();
			const newState = addOnsReducer( state, addOnsActions.addManyAddOns( {
				...ENTITIES,
				foo: {
					id: "foo",
					isActive: true,
					hasLicense: true,
					ctb: { action: "act-foo", id: "ctb-foo" },
				},
			} ) );
			expect( newState ).toEqual( {
				entities: { premium: ENTITIES.premium, woo: ENTITIES.woo },
				ids: Object.values( ENTITIES ).map( ( entity ) => entity.id ),
			} );
		} );
	} );
} );

describe( "selectors", () => {
	const state = {
		[ ADD_ONS_NAME ]: {
			entities: ENTITIES,
			ids: Object.values( ENTITIES ).map( ( entity ) => entity.id ),
		},
	};

	describe( "selectAddOnById", () => {
		it( "should exist", () => {
			expect( addOnsSelectors.selectAddOnById ).toBeDefined();
		} );

		it( "should return the add-on", () => {
			expect( addOnsSelectors.selectAddOnById( state, "premium" ) ).toEqual( ENTITIES.premium );
			expect( addOnsSelectors.selectAddOnById( state, "woo" ) ).toEqual( ENTITIES.woo );
		} );
	} );

	describe( "selectAddOnIsActive", () => {
		it( "should exist", () => {
			expect( addOnsSelectors.selectAddOnIsActive ).toBeDefined();
		} );

		it( "should return the active state", () => {
			expect( addOnsSelectors.selectAddOnIsActive( state, "premium" ) ).toEqual( ENTITIES.premium.isActive );
			expect( addOnsSelectors.selectAddOnIsActive( state, "woo" ) ).toEqual( ENTITIES.woo.isActive );
		} );
	} );

	describe( "selectAddOnHasLicense", () => {
		it( "should exist", () => {
			expect( addOnsSelectors.selectAddOnHasLicense ).toBeDefined();
		} );

		it( "should return the license state", () => {
			expect( addOnsSelectors.selectAddOnHasLicense( state, "premium" ) ).toEqual( ENTITIES.premium.hasLicense );
			expect( addOnsSelectors.selectAddOnHasLicense( state, "woo" ) ).toEqual( ENTITIES.woo.hasLicense );
		} );
	} );

	describe( "selectAddOnClickToBuy", () => {
		it( "should exist", () => {
			expect( addOnsSelectors.selectAddOnClickToBuy ).toBeDefined();
		} );

		it( "should return the click-to-buy config", () => {
			expect( addOnsSelectors.selectAddOnClickToBuy( state, "premium" ) ).toEqual( ENTITIES.premium.ctb );
			expect( addOnsSelectors.selectAddOnClickToBuy( state, "woo" ) ).toEqual( ENTITIES.woo.ctb );
		} );
	} );

	describe( "selectAddOnClickToBuyAsProps", () => {
		it( "should exist", () => {
			expect( addOnsSelectors.selectAddOnClickToBuyAsProps ).toBeDefined();
		} );

		it( "should return the click-to-buy config as props", () => {
			expect( addOnsSelectors.selectAddOnClickToBuyAsProps( state, "premium" ) ).toEqual( {
				"data-action": ENTITIES.premium.ctb.action,
				"data-ctb-id": ENTITIES.premium.ctb.id,
			} );
			expect( addOnsSelectors.selectAddOnClickToBuyAsProps( state, "woo" ) ).toEqual( {
				"data-action": ENTITIES.woo.ctb.action,
				"data-ctb-id": ENTITIES.woo.ctb.id,
			} );
		} );
	} );
} );
