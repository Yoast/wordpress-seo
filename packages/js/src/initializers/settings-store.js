import { combineReducers, registerStore } from "@wordpress/data";
import { reducers, selectors, actions } from "@yoast/externals/redux";
import { get } from "lodash";
import * as controls from "../redux/controls/dismissedAlerts";

const { dismissedAlerts, settings, snippetEditor } = reducers;
const { getRecommendedReplaceVars, getReplaceVars, isAlertDismissed } = selectors;
const { dismissAlert, setSettings, updateReplacementVariable } = actions;

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
		} ),
		selectors: {
			isAlertDismissed,
			getReplaceVars,
			getRecommendedReplaceVars,
		},
		actions: {
			dismissAlert,
		},
		controls,
	} );

	populateStore( store );

	return store;
}
