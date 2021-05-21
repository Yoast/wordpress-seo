/* global wpseoAddonInstallationL10n */

import { render } from "@wordpress/element";
import AddonInstallationSuccessful from "./components/AddonInstallationSuccessful";

const elementToInsert = document.createElement( "div" );
elementToInsert.setAttribute( "id", "wpseo-app-addon-installation-success-message" );

// Insert under the first heading on the page.
document.getElementById( "yoast-heading-extensions" ).append( elementToInsert );

render(
	<AddonInstallationSuccessful configurationWizardUrl={ wpseoAddonInstallationL10n.configurationWizardUrl } />,
	elementToInsert
);
