import { pickBy } from "lodash";
import { registerStore, combineReducers } from "@wordpress/data";
import dismissedAlertsReducer from "../redux/reducers/dismissedAlerts";
import * as selectors from "../redux/selectors/dismissedAlerts";
import * as actions from "../redux/actions/dismissedAlerts";
import * as controls from "../redux/controls/dismissedAlerts";

const reducers = {
	dismissedAlerts: dismissedAlertsReducer,
};

/**
 * Initializes the Yoast SEO settings store.
 *
 * @returns {object} The Yoast SEO settings store.
 */
export default function initSettingsStore() {
	const store = registerStore( "yoast-seo/settings", {
		reducer: combineReducers( reducers ),
		selectors,
		actions: pickBy( actions, x => typeof x === "function" ),
		controls,
	} );

	return store;
}
