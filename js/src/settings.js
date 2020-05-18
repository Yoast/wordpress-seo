/* global wpseoScriptData */
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initSearchAppearance from "./initializers/search-appearance";

initAdmin( jQuery );
if ( wpseoScriptData && typeof wpseoScriptData.media !== "undefined" ) {
	initAdminMedia( jQuery );
}
if ( wpseoScriptData && typeof wpseoScriptData.searchAppearance !== "undefined" ) {
	initSearchAppearance();
}
