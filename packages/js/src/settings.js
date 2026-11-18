/* global wpseoScriptData */
import domReady from "@wordpress/dom-ready";
import jQuery from "jquery";
import initAdmin from "./initializers/admin";
import initSettingsStore from "./initializers/settings-store";
import initSettingsHeader from "./initializers/settings-header";

initAdmin( jQuery );

if ( wpseoScriptData ) {
	if ( typeof wpseoScriptData.dismissedAlerts !== "undefined" ) {
		initSettingsStore();
	}

	domReady( () => {
		// Initialize React in settings header.
		initSettingsHeader();
	} );
}
