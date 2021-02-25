/* global wpseoScriptData */
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initSearchAppearance from "./initializers/search-appearance";
import initSocialSettings from "./initializers/social-settings";
import initSettingsStore from "./initializers/settings-store";

initAdmin( jQuery );
if ( wpseoScriptData && typeof wpseoScriptData.media !== "undefined" ) {
	initAdminMedia( jQuery );
}
if ( wpseoScriptData && typeof wpseoScriptData.searchAppearance !== "undefined" ) {
	initSearchAppearance();
}
if ( wpseoScriptData && typeof wpseoScriptData.social !== "undefined" ) {
	initSocialSettings();
}
if ( wpseoScriptData && typeof wpseoScriptData.dismissedAlerts !== "undefined" ) {
	initSettingsStore();
}
