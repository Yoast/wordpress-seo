import { render } from "@wordpress/element";
import AddonInstallationSuccessful from "./components/AddonInstallationSuccessful";

const elementToInsert = document.createElement( "div" );
elementToInsert.setAttribute( "id", "wpseo-app-element-2" );

// Insert under the first heading on the page.
const elementToAppend = document.getElementsByClassName( "yoast-heading-highlight" )[ 0 ].parentElement;
elementToAppend.append( elementToInsert );

render(
	<AddonInstallationSuccessful />,
	elementToInsert
);
