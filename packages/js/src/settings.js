/* global wpseoScriptData */
import domReady from "@wordpress/dom-ready";
import jQuery from "jquery";
import initAdmin from "./initializers/admin";
import initAdminMedia from "./initializers/admin-media";
import initSettingsStore from "./initializers/settings-store";
import initSettingsHeader from "./initializers/settings-header";

initAdmin( jQuery );

// eslint-disable-next-line complexity
if ( wpseoScriptData ) {
	if ( typeof wpseoScriptData.media !== "undefined" ) {
		initAdminMedia( jQuery );
	}

	if ( typeof wpseoScriptData.dismissedAlerts !== "undefined" ) {
		initSettingsStore();
	}

	domReady( () => {
		// Initialize React in settings header.
		initSettingsHeader();
	} );
}
