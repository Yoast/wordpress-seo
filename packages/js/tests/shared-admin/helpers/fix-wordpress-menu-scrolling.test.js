import { fixWordPressMenuScrolling } from "../../../src/shared-admin/helpers";

/**
 * Creates a div with an ID and adds it to the body.
 * @param {string} id The ID.
 * @returns {HTMLDivElement} The div.
 */
const createDiv = ( id ) => {
	const div = document.createElement( "div" );
	div.id = id;
	document.body.appendChild( div );
	return div;
};

describe( "fixWordPressMenuScrolling", () => {
	it( "does not throw an error when the elements are not there", () => {
		expect( fixWordPressMenuScrolling ).not.toThrow();
	} );

	it( "sets the minHeight of #wpcontent to the offsetHeight of #adminmenuwrap", () => {
		// Create the elements.
		const content = createDiv( "wpcontent" );
		const menu = createDiv( "adminmenuwrap" );

		// Run and test.
		expect( content.style.minHeight ).toBe( "" );
		fixWordPressMenuScrolling();
		expect( content.style.minHeight ).toBe( "0px" );

		// Cleanup.
		content.remove();
		menu.remove();
	} );
} );
