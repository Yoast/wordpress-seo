import { combineReducers, registerStore } from "@wordpress/data";
import { get } from "lodash";
import { dismissAlert, setSettings, updateReplacementVariable } from "../redux/actions";
import * as controls from "../redux/controls/dismissedAlerts";
import dismissedAlerts from "../redux/reducers/dismissedAlerts";
import settings from "../redux/reducers/settings";
import snippetEditor from "../redux/reducers/snippetEditor";
import { getRecommendedReplaceVars, getReplaceVars, isAlertDismissed } from "../redux/selectors";

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
