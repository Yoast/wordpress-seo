import { navigateByNavText } from "@yoast/admin-ui-toolkit/helpers";
import initialize from "../../src";
/**
 * A helper function, allowing us the adjust the config on a test by test basis.
 *
 * @param {Object} config       The adjusted config.
 * @param {string} navText      The text of the nav to click.
 * @param {string} navGroupText The text of the navGroup to click.
 *
 * @returns {void}
 */
export function startTheApp( config, navText = "", navGroupText = "" ) {
	// Initialize the app.
	const settingsApp = initialize( config );

	// Render the app.
	settingsApp.render( document.getElementById( "app" ) );

	// If a navText was supplied, the tester wants to start the test on a certain page.
	if ( navText ) {
		navigateByNavText( navText, navGroupText );
	}
}
