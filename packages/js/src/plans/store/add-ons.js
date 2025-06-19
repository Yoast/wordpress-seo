import { createEntityAdapter, createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
import { get, map } from "lodash";

/** @typedef {import("./types").AddOn} AddOn */

export const ADD_ONS_NAME = "addOns";

const adapter = createEntityAdapter( {
	selectId: ( addOn ) => addOn.id,
	sortComparer: ( a, b ) => a.name.localeCompare( b.name ),
} );

/**
 * Prepares an add-on object to ensure it has the necessary properties.
 *
 * @param {Object} addOn The add-on object to prepare.
 *
 * @returns {AddOn} The prepared add-on object.
 */
const prepareAddOn = ( addOn ) => ( {
	id: addOn?.id ? String( addOn.id ) : `add-on-${ nanoid() }`,
	name: String( addOn.name ),
	isActive: Boolean( addOn?.isActive ),
	hasLicense: Boolean( addOn?.hasLicense ),
	upsellConfig: {
		action: get( addOn, "upsellConfig.action", "" ),
		ctbId: get( addOn, "upsellConfig.ctbId", "" ),
	},
} );

const slice = createSlice( {
	name: ADD_ONS_NAME,
	initialState: adapter.getInitialState(),
	reducers: {
		addManyAddOns: {
			reducer: adapter.addMany,
			prepare: ( addOns ) => ( { payload: map( addOns, prepareAddOn ) } ),
		},
	},
} );

export const getInitialAddOnsState = slice.getInitialState;

const adapterSelectors = adapter.getSelectors( ( state ) => state[ ADD_ONS_NAME ] );

/**
 * Returns a default value for a given path in an add-on object.
 * @param {string} path The path to check in the add-on object.
 * @returns {*} The default value for the specified path.
 */
const getDefaultValueForPath = ( path ) => {
	switch ( path ) {
		default:
			return "";
		case "isActive":
		case "hasLicense":
			return false;
		case "upsellConfig":
			return {
				action: "",
				ctbId: "",
			};
		case "upsellConfig.action":
			return "";
		case "upsellConfig.ctbId":
			return "";
	}
};

export const addOnsSelectors = {
	selectAddOns: adapterSelectors.selectAll,
	selectAddOnById: adapterSelectors.selectById,
};
addOnsSelectors.selectAddOnValue = createSelector(
	[
		addOnsSelectors.selectAddOnById,
		( state, id, path ) => path,
	],
	( addOn, path ) => get( addOn, path, getDefaultValueForPath( path ) )
);
addOnsSelectors.selectAddOnIsActiveAndLicensed = createSelector(
	[
		( state, id ) => addOnsSelectors.selectAddOnValue( state, id, "isActive" ),
		( state, id ) => addOnsSelectors.selectAddOnValue( state, id, "hasLicense" ),
	],
	( isActive, hasLicense ) => isActive && hasLicense
);
addOnsSelectors.selectAddOnUpsellConfigAsProps = createSelector(
	[
		( state, id ) => addOnsSelectors.selectAddOnValue( state, id, "upsellConfig" ),
	],
	( upsellConfig ) => ( {
		"data-action": upsellConfig.action,
		"data-ctb-id": upsellConfig.ctbId,
	} )
);

export const addOnsActions = slice.actions;

export const addOnsReducer = slice.reducer;
