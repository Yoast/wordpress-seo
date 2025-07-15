// eslint-disable-next-line import/named -- We use an incorrect WP data version locally.
import { combineReducers, createReduxStore, register } from "@wordpress/data";
import { merge } from "lodash";
import {
	getInitialHasAiGeneratorConsentState,
	HAS_AI_GENERATOR_CONSENT_NAME,
	hasAiGeneratorConsentActions,
	hasAiGeneratorConsentControls,
	hasAiGeneratorConsentReducer,
	hasAiGeneratorConsentSelectors,
} from "../../shared-admin/store";
import { STORE_NAME_AI } from "../constants";
import {
	APPLIED_SUGGESTIONS_NAME,
	appliedSuggestionsActions,
	appliedSuggestionsReducer,
	appliedSuggestionsSelectors,
	getInitialAppliedSuggestionsState,
} from "./applied-suggestions";
import {
	getInitialProductSubscriptionsState,
	PRODUCT_SUBSCRIPTIONS_NAME,
	productSubscriptionsActions,
	productSubscriptionsReducer,
	productSubscriptionsSelectors,
} from "./product-subscriptions";
import {
	getInitialPromptContentState,
	PROMPT_CONTENT_NAME,
	promptContentActions,
	promptContentReducer,
	promptContentSelectors,
} from "./prompt-content";
import {
	getInitialUsageCount,
	USAGE_COUNT_NAME,
	usageCountActions,
	usageCountControls,
	usageCountReducer,
	usageCountSelectors,
} from "./usage-count";
import {
	FREE_SPARKS_NAME,
	getInitialFreeSparks,
	freeSparksActions,
	freeSparksSelectors,
	freeSparksReducer,
	freeSparksControls,
} from "./free-sparks";

/** @typedef {import("@wordpress/data/src/types").WPDataStore} WPDataStore */

/**
 * @param {Object} initialState Initial state.
 * @returns {WPDataStore} The WP data store.
 */
const createStore = ( initialState ) => {
	return createReduxStore( STORE_NAME_AI, {
		actions: {
			...hasAiGeneratorConsentActions,
			...appliedSuggestionsActions,
			...productSubscriptionsActions,
			...promptContentActions,
			...usageCountActions,
			...freeSparksActions,
		},
		selectors: {
			...hasAiGeneratorConsentSelectors,
			...appliedSuggestionsSelectors,
			...productSubscriptionsSelectors,
			...promptContentSelectors,
			...usageCountSelectors,
			...freeSparksSelectors,
		},
		initialState: merge(
			{},
			{
				[ HAS_AI_GENERATOR_CONSENT_NAME ]: getInitialHasAiGeneratorConsentState(),
				[ APPLIED_SUGGESTIONS_NAME ]: getInitialAppliedSuggestionsState(),
				[ PRODUCT_SUBSCRIPTIONS_NAME ]: getInitialProductSubscriptionsState(),
				[ PROMPT_CONTENT_NAME ]: getInitialPromptContentState(),
				[ USAGE_COUNT_NAME ]: getInitialUsageCount(),
				[ FREE_SPARKS_NAME ]: getInitialFreeSparks(),
			},
			initialState
		),
		reducer: combineReducers( {
			[ HAS_AI_GENERATOR_CONSENT_NAME ]: hasAiGeneratorConsentReducer,
			[ APPLIED_SUGGESTIONS_NAME ]: appliedSuggestionsReducer,
			[ PRODUCT_SUBSCRIPTIONS_NAME ]: productSubscriptionsReducer,
			[ PROMPT_CONTENT_NAME ]: promptContentReducer,
			[ USAGE_COUNT_NAME ]: usageCountReducer,
			[ FREE_SPARKS_NAME ]: freeSparksReducer,
		} ),
		controls: {
			...hasAiGeneratorConsentControls,
			...usageCountControls,
			...freeSparksControls,
		},
	} );
};

/**
 * Registers the store to WP data's default registry.
 * @param {Object} [initialState] Initial state.
 * @returns {void}
 */
export const registerStore = ( initialState = {} ) => {
	register( createStore( initialState ) );
};
