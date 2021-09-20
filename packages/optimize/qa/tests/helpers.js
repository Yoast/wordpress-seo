import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
	const contentListApp = initialize( config );

	// Render the app.
	contentListApp.render( document.getElementById( "app" ) );

	// If a navText was supplied, the tester wants to start the test on a certain page.
	if ( navText ) {
		navigateByNavText( navText, navGroupText );
	}
}

/**
 * Tests whether a select is present, and has all the expected options, and only those.
 *
 * @param {string} visibleText    The text that is initially visible on the select.
 * @param {Array} expectedOptions The options that should be present when the options are opened.
 *
 * @returns {void}
 */
export function testSelectOptions( visibleText, expectedOptions ) {
	const Select = screen.getByText( visibleText ).parentElement;
	userEvent.click( Select );
	const SelectOptions = screen.getByRole( "listbox" );

	expectedOptions.forEach( option => {
		within( SelectOptions ).getByText( option );
	} );
	// Those were all the options.
	expect( SelectOptions.children.length ).toEqual( expectedOptions.length );
}
