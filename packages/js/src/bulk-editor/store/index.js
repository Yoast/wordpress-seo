import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import { getInitialLinkParamsState, LINK_PARAMS_NAME, linkParamsActions, linkParamsReducer, linkParamsSelectors } from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import activeContentType, { activeContentTypeActions, activeContentTypeSelectors, createInitialActiveContentTypeState } from "./active-content-type";
import activeFieldSet, { activeFieldSetActions, activeFieldSetSelectors, createInitialActiveFieldSetState } from "./active-field-set";
import edits, { createInitialEditsState, editsActions, editsSelectors } from "./edits";
import externalPendingChanges, {
	createInitialExternalPendingChangesState,
	externalPendingChangesActions,
	externalPendingChangesSelectors,
} from "./external-pending-changes";
import externalGeneration, {
	createInitialExternalGenerationState,
	externalGenerationActions,
	externalGenerationSelectors,
} from "./external-generation";
import preferences, { createInitialPreferencesState, preferencesActions, preferencesSelectors } from "./preferences";
import query, { createInitialQueryState, queryActions, querySelectors } from "./query";
import selection, { createInitialSelectionState, selectionActions, selectionSelectors } from "./selection";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( { initialState } ) => {
	return createReduxStore( STORE_NAME, {
		actions: {
			...linkParamsActions,
			...preferencesActions,
			...activeFieldSetActions,
			...activeContentTypeActions,
			...queryActions,
			...selectionActions,
			...editsActions,
			...externalPendingChangesActions,
			...externalGenerationActions,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			...activeFieldSetSelectors,
			...activeContentTypeSelectors,
			...querySelectors,
			...selectionSelectors,
			...editsSelectors,
			...externalPendingChangesSelectors,
			...externalGenerationSelectors,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				activeFieldSet: createInitialActiveFieldSetState(),
				activeContentType: createInitialActiveContentTypeState(),
				query: createInitialQueryState(),
				selection: createInitialSelectionState(),
				edits: createInitialEditsState(),
				externalPendingChanges: createInitialExternalPendingChangesState(),
				externalGeneration: createInitialExternalGenerationState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			activeFieldSet,
			activeContentType,
			query,
			selection,
			edits,
			externalPendingChanges,
			externalGeneration,
		} ),
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
const registerStore = ( { initialState = {} } = {} ) => {
	register( createStore( { initialState } ) );
};

export default registerStore;
