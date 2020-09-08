/* global wpseoScriptData, jQuery */
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
if ( wpseoScriptData && wpseoScriptData.isDashboard ) {
	jQuery( document ).ready( function() {
		jQuery( ".switch-container input[type=radio]" ).change( function() {
			/*
			 * Use document.getElementById, because the name is in the form `wpseo[some-name]`.
			 * jQuery cannot handle the square brackets in the ID.
			 */
			const warningPanel = document.getElementById( `${ this.name }-warning` );

			if ( this.value === "off" ) {
				jQuery( warningPanel ).show();
			} else {
				jQuery( warningPanel ).hide();
			}
		} );
	} );
}
