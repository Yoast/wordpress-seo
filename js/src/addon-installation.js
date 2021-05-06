/* global wpseoPluginInstallationL10n */

import { render } from "@wordpress/element";
import AddonInstallation from "./components/AddonInstallation";

const element = document.createElement( "div" );
element.setAttribute( "id", "wpseo-app-element" );
document.getElementById( "extensions" ).append( element );

render(
	<AddonInstallation nonce={ wpseoPluginInstallationL10n.nonce } addons={ wpseoPluginInstallationL10n.addons } />,
	element
);
