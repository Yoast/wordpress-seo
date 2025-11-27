import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	getInitialLinkParamsState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
} from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import { ADD_ONS_NAME, addOnsActions, addOnsReducer, addOnsSelectors, getInitialAddOnsState } from "./add-ons";
import { getInitialPreferencesState, PREFERENCES_NAME, preferencesActions, preferencesReducer, preferencesSelectors } from "./preferences";
import {
	DUPLICATE_POST_NAME,
	duplicatePostActions,
	duplicatePostReducer,
	duplicatePostSelectors,
	getInitialDuplicatePostState,
} from "./duplicate-post";
import {
	USER_CAN_NAME,
	userCanActions,
	userCanReducer,
	userCanSelectors,
	getInitialUserCanState,
} from "./user-can";
import { reducers, selectors } from "@yoast/externals/redux";

const { currentPromotions } = reducers;
const { isPromotionActive } = selectors;

const CURRENT_PROMOTIONS_NAME = "currentPromotions";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...addOnsActions,
			...duplicatePostActions,
			...linkParamsActions,
			...preferencesActions,
			...userCanActions,
		},
		selectors: {
			...addOnsSelectors,
			...duplicatePostSelectors,
			...linkParamsSelectors,
			...preferencesSelectors,
			...userCanSelectors,
			isPromotionActive,
		},
		initialState: merge(
			{},
			{
				[ ADD_ONS_NAME ]: getInitialAddOnsState(),
				[ CURRENT_PROMOTIONS_NAME ]: { promotions: [] },
				[ DUPLICATE_POST_NAME ]: getInitialDuplicatePostState(),
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				[ PREFERENCES_NAME ]: getInitialPreferencesState(),
				[ USER_CAN_NAME ]: getInitialUserCanState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ ADD_ONS_NAME ]: addOnsReducer,
			[ DUPLICATE_POST_NAME ]: duplicatePostReducer,
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			[ PREFERENCES_NAME ]: preferencesReducer,
			[ USER_CAN_NAME ]: userCanReducer,
			currentPromotions,
		} ),
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( { initialState = {} } = {} ) => {
	register( createStore( { initialState } ) );
};

// Re-export the names of the registered store slices.
export {
	ADD_ONS_NAME,
	CURRENT_PROMOTIONS_NAME,
	DUPLICATE_POST_NAME,
	LINK_PARAMS_NAME,
	PREFERENCES_NAME,
	USER_CAN_NAME,
};
