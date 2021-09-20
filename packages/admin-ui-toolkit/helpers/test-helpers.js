import { fireEvent, screen, within } from "@testing-library/react";

/**
 * Navigates by clicking a nav, if it can be found. Optionally, pass a navgroup to click that first (to expand the navgroup).
 *
 * @param {string} navText      The text on the nav to click;
 * @param {string} navGroupText The text on the navgroup to expand first.
 *
 * @returns {void}
 */
export function navigateByNavText( navText, navGroupText = "" ) {
	const navigation = screen.getByRole( "navigation" );

	if ( navGroupText ) {
		// Locate the navgroup button.
		const navGroupButton = within( navigation ).getByText( navGroupText );
		// Click it.
		fireEvent.click( navGroupButton );
	}

	// Locate the nav button.
	const navButton = within( navigation ).getByText( navText );
	// Click it.
	fireEvent.click( navButton );
}

/**
 * Finds headers by a specific text among headers.
 *
 * @param {String} text The text of the heading to find.
 * @param {Integer} level The level among which to find the headers.
 *
 * @returns {Array} An array of all elements, or an empty array.
 */
export function findHeadersByText( text, level ) {
	return screen.getAllByRole( "heading", { level: level } ).filter( heading => heading.textContent === text );
}

/**
 * Tests the ReplaceVarEditor's console errors once for all tests.
 *
 * These warnings and errors are only output once per session.
 * This makes sure that we don't rely on the test order and test it the first time.
 *
 * @param {boolean} isFirstTest Whether this is the first test or not.
 * @param {Object} console The console, containing 'warn', 'error' etc.
 *
 * @returns {boolean} The new value of isFirstTest.
 */
export function testReplaceVarConsoleOutputOnce( isFirstTest, console ) {
	if ( isFirstTest ) {
		expect( console ).toHaveWarned( "Warning: componentWillMount has been renamed" );
		expect( console ).toHaveErrored( "Error: Domain `yoast-components` was not found" );
		return false;
	}
	return isFirstTest;
}
