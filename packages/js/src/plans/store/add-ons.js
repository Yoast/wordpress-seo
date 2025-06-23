import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { filter, get, map } from "lodash";
import { ADD_ONS } from "../constants";

/** @type {import("./types").AddOn} AddOn */

/**
 * @type {string} The name of the add-ons slice in the Redux store.
 */
export const ADD_ONS_NAME = "addOns";

const adapter = createEntityAdapter( {
	selectId: ( addOn ) => addOn.id,
	sortComparer: ( a, b ) => a.id.localeCompare( b.id ),
} );

/**
 * Prepares an add-on object to ensure it has the necessary properties.
 *
 * @param {Object} addOn The add-on object to prepare.
 *
 * @returns {?AddOn} The prepared add-on object or null if the input is invalid.
 */
const prepareAddOn = ( addOn ) => {
	// Ensure the add-on is an object and has a valid id.
	if ( typeof addOn !== "object" || ! Object.keys( ADD_ONS ).includes( String( addOn.id ) ) ) {
		return null;
	}

	return {
		id: String( addOn.id ),
		isActive: Boolean( addOn.isActive ),
		hasLicense: Boolean( addOn.hasLicense ),
		upsellConfig: {
			action: get( addOn, "upsellConfig.action", "" ),
			ctbId: get( addOn, "upsellConfig.ctbId", "" ),
		},
	};
};

const slice = createSlice( {
	name: ADD_ONS_NAME,
	initialState: adapter.getInitialState(),
	reducers: {
		addManyAddOns: {
			reducer: adapter.addMany,
			// Prepare the add-ons by filtering out invalid entries and ensuring they have the necessary properties.
			prepare: ( addOns ) => ( { payload: filter( map( addOns, prepareAddOn ), Boolean ) } ),
		},
	},
} );

export const getInitialAddOnsState = slice.getInitialState;

const adapterSelectors = adapter.getSelectors( ( state ) => state[ ADD_ONS_NAME ] );

export const addOnsSelectors = {
	selectAddOns: adapterSelectors.selectAll,
	selectAddOnById: adapterSelectors.selectById,
};
addOnsSelectors.selectAddOnIsActive = createSelector(
	[ addOnsSelectors.selectAddOnById ],
	( addOn ) => addOn.isActive
);
addOnsSelectors.selectAddOnHasLicense = createSelector(
	[ addOnsSelectors.selectAddOnById ],
	( addOn ) => addOn.hasLicense
);
addOnsSelectors.selectAddOnUpsellConfig = createSelector(
	[ addOnsSelectors.selectAddOnById ],
	( addOn ) => addOn.upsellConfig
);
addOnsSelectors.selectAddOnUpsellConfigAsProps = createSelector(
	[ addOnsSelectors.selectAddOnUpsellConfig ],
	( upsellConfig ) => ( {
		"data-action": upsellConfig.action,
		"data-ctb-id": upsellConfig.ctbId,
	} )
);

export const addOnsActions = slice.actions;

export const addOnsReducer = slice.reducer;
