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
	getInitialPromptContentFixAssessmentsState,
	PROMPT_CONTENT_FIX_ASSESSMENTS_NAME,
	promptContentFixAssessmentsSelectors,
	promptContentFixAssessmentsActions,
	promptContentFixAssessmentsReducer,
} from "./prompt-content-fix-assessments";
import {
	APPLIED_FIXES_STATUS_NAME,
	appliedFixesStatusActions,
	appliedFixesStatusReducer,
	appliedFixesStatusSelectors,
	getInitialAppliedFixesStatusState,
} from "./applied-assessment-fixes-status";
import {
	USAGE_COUNT_NAME,
	usageCountActions,
	usageCountReducer,
	UsageCountSelectors,
	getInitialUsageCount,
	usageCountControls,
} from "./usage-count";
import {
	AI_OPTIMIZE_NOTIFICATION_STATUS_NAME,
	aiOptimizeNotificationStatusActions,
	aiOptimizeNotificationStatusReducer,
	aiOptimizeNotificationStatusSelectors,
	getInitialNotificationStatusState,
} from "./ai-optimize-notification-status";

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
			...promptContentFixAssessmentsActions,
			...appliedFixesStatusActions,
			...usageCountActions,
			...aiOptimizeNotificationStatusActions,
		},
		selectors: {
			...hasAiGeneratorConsentSelectors,
			...appliedSuggestionsSelectors,
			...productSubscriptionsSelectors,
			...promptContentSelectors,
			...promptContentFixAssessmentsSelectors,
			...appliedFixesStatusSelectors,
			...UsageCountSelectors,
			...aiOptimizeNotificationStatusSelectors,
		},
		initialState: merge(
			{},
			{
				[ HAS_AI_GENERATOR_CONSENT_NAME ]: getInitialHasAiGeneratorConsentState(),
				[ APPLIED_SUGGESTIONS_NAME ]: getInitialAppliedSuggestionsState(),
				[ PRODUCT_SUBSCRIPTIONS_NAME ]: getInitialProductSubscriptionsState(),
				[ PROMPT_CONTENT_NAME ]: getInitialPromptContentState(),
				[ PROMPT_CONTENT_FIX_ASSESSMENTS_NAME ]: getInitialPromptContentFixAssessmentsState(),
				[ APPLIED_FIXES_STATUS_NAME ]: getInitialAppliedFixesStatusState(),
				[ USAGE_COUNT_NAME ]: getInitialUsageCount(),
				[ AI_OPTIMIZE_NOTIFICATION_STATUS_NAME ]: getInitialNotificationStatusState(),
			},
			initialState,
		),
		reducer: combineReducers( {
			[ HAS_AI_GENERATOR_CONSENT_NAME ]: hasAiGeneratorConsentReducer,
			[ APPLIED_SUGGESTIONS_NAME ]: appliedSuggestionsReducer,
			[ PRODUCT_SUBSCRIPTIONS_NAME ]: productSubscriptionsReducer,
			[ PROMPT_CONTENT_NAME ]: promptContentReducer,
			[ PROMPT_CONTENT_FIX_ASSESSMENTS_NAME ]: promptContentFixAssessmentsReducer,
			[ APPLIED_FIXES_STATUS_NAME ]: appliedFixesStatusReducer,
			[ USAGE_COUNT_NAME ]: usageCountReducer,
			[ AI_OPTIMIZE_NOTIFICATION_STATUS_NAME ]: aiOptimizeNotificationStatusReducer,
		} ),
		controls: {
			...hasAiGeneratorConsentControls,
			...usageCountControls,
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
