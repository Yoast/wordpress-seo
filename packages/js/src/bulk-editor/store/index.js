import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	getInitialLinkParamsState,
	getInitialOptInNotificationState,
	LINK_PARAMS_NAME,
	linkParamsActions,
	linkParamsReducer,
	linkParamsSelectors,
	OPT_IN_NOTIFICATION_NAME,
	optInNotificationActions,
	optInNotificationControls,
	optInNotificationReducer,
	optInNotificationSelectors,
	getInitialMyyoastConnectionState,
	MYYOAST_CONNECTION_NAME,
	myyoastConnectionActions,
	myyoastConnectionReducer,
	myyoastConnectionSelectors,
	replacementVariablesActions,
	replacementVariablesReducer,
	replacementVariablesSelectors,
} from "../../shared-admin/store";
import { STORE_NAME } from "../constants";
import activeContentType, { activeContentTypeActions, activeContentTypeSelectors, createInitialActiveContentTypeState } from "./active-content-type";
import analysis, { analysisActions, analysisSelectors, createInitialAnalysisState } from "./analysis";
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
import pendingSwitch, { createInitialPendingSwitchState, pendingSwitchActions, pendingSwitchSelectors } from "./pending-switch";
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
			...analysisActions,
			...replacementVariablesActions,
			...activeFieldSetActions,
			...activeContentTypeActions,
			...queryActions,
			...selectionActions,
			...editsActions,
			...externalPendingChangesActions,
			...externalGenerationActions,
			...pendingSwitchActions,
			...optInNotificationActions,
			...myyoastConnectionActions,
		},
		selectors: {
			...linkParamsSelectors,
			...preferencesSelectors,
			...analysisSelectors,
			...replacementVariablesSelectors,
			...activeFieldSetSelectors,
			...activeContentTypeSelectors,
			...querySelectors,
			...selectionSelectors,
			...editsSelectors,
			...externalPendingChangesSelectors,
			...externalGenerationSelectors,
			...pendingSwitchSelectors,
			...optInNotificationSelectors,
			...myyoastConnectionSelectors,
		},
		initialState: merge(
			{},
			{
				[ LINK_PARAMS_NAME ]: getInitialLinkParamsState(),
				preferences: createInitialPreferencesState(),
				analysis: createInitialAnalysisState(),

				activeFieldSet: createInitialActiveFieldSetState(),
				activeContentType: createInitialActiveContentTypeState(),
				query: createInitialQueryState(),
				selection: createInitialSelectionState(),
				edits: createInitialEditsState(),
				externalPendingChanges: createInitialExternalPendingChangesState(),
				externalGeneration: createInitialExternalGenerationState(),
				pendingSwitch: createInitialPendingSwitchState(),
				[ OPT_IN_NOTIFICATION_NAME ]: getInitialOptInNotificationState(),
				[ MYYOAST_CONNECTION_NAME ]: getInitialMyyoastConnectionState(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ LINK_PARAMS_NAME ]: linkParamsReducer,
			preferences,
			analysis,
			replacementVariables: replacementVariablesReducer,
			activeFieldSet,
			activeContentType,
			query,
			selection,
			edits,
			externalPendingChanges,
			externalGeneration,
			pendingSwitch,
			[ OPT_IN_NOTIFICATION_NAME ]: optInNotificationReducer,
			[ MYYOAST_CONNECTION_NAME ]: myyoastConnectionReducer,
		} ),
		controls: {
			...optInNotificationControls,
		},
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
