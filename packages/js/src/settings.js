/* global wpseoScriptData */
import domReady from "@wordpress/dom-ready";
import jQuery from "jquery";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initSearchAppearance from "./initializers/search-appearance";
import initSettingsStore from "./initializers/settings-store";
import initSettingsHeader from "./initializers/settings-header";
import initSocialSettings from "./initializers/social-settings";

initAdmin( jQuery );

// eslint-disable-next-line complexity
if ( wpseoScriptData ) {
	if ( typeof wpseoScriptData.media !== "undefined" ) {
		initAdminMedia( jQuery );
	}

	const isSearchAppearancePage = typeof wpseoScriptData.searchAppearance !== "undefined";
	if ( isSearchAppearancePage || typeof wpseoScriptData.dismissedAlerts !== "undefined" ) {
		initSettingsStore();
	}

	domReady( () => {
		// Initialize React in settings header.
		initSettingsHeader();

		if ( isSearchAppearancePage ) {
			initSearchAppearance();
		}

		// Init social settings on DOM ready because it relies on global WP APIs
		if ( typeof wpseoScriptData.social !== "undefined" ) {
			initSocialSettings();
		}
	} );
}
