import { combineReducers, registerStore } from "@wordpress/data";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import { get } from "lodash";
import * as controls from "../redux/controls/dismissedAlerts";

const { dismissedAlerts, settings, snippetEditor, isPremium } = reducers;
const { getRecommendedReplaceVars, getReplaceVars, isAlertDismissed, getIsPremium } = selectors;
const { dismissAlert, setDismissedAlerts, setSettings, updateReplacementVariable, setIsPremium } = actions;

/**
 * Populates the store.
 *
 * @param {Object} store The store to populate.
 *
 * @returns {void}
 */
function populateStore( store ) {
	const replaceVars = get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars", [] );
	const recommendedReplacementVariables = get( window, "wpseoScriptData.analysis.plugins.replaceVars.recommended_replace_vars", {} );

	store.dispatch(
		setSettings( {
			snippetEditor: {
				recommendedReplacementVariables,
			},
		} )
	);

	replaceVars.forEach( replacementVariable => {
		const name = replacementVariable.name.replace( / /g, "_" );

		store.dispatch( updateReplacementVariable(
			name,
			replacementVariable.value,
			replacementVariable.label
		) );
	} );

	store.dispatch( setDismissedAlerts( get( window, "wpseoScriptData.dismissedAlerts", {} ) ) );
	store.dispatch( setIsPremium( Boolean( get( window, "wpseoScriptData.isPremium", false ) ) ) );
}

/**
 * Initializes the Yoast SEO settings store.
 *
 * @returns {object} The Yoast SEO settings store.
 */
export default function initSettingsStore() {
	const store = registerStore( "yoast-seo/settings", {
		reducer: combineReducers( {
			dismissedAlerts,
			settings,
			snippetEditor,
			isPremium,
		} ),
		selectors: {
			isAlertDismissed,
			getReplaceVars,
			getRecommendedReplaceVars,
			getIsPremium,
		},
		actions: {
			dismissAlert,
			setDismissedAlerts,
			setIsPremium,
		},
		controls,
	} );

	populateStore( store );

	return store;
}
