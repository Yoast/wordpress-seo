/* global wpseoScriptData */
import jQuery from "jquery";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initSearchAppearance from "./initializers/search-appearance";
import initSettingsStore from "./initializers/settings-store";
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
	if ( isSearchAppearancePage ) {
		initSearchAppearance();
	}

	if ( typeof wpseoScriptData.social !== "undefined" ) {
		initSocialSettings();
	}
}


