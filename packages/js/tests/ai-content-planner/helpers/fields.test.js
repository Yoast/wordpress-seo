import {
	getIsBannerDismissedFromInput,
	getIsBannerRenderedFromInput,
	setBannerDismissedInput,
	setBannerRenderedInput,
} from "../../../src/ai-content-planner/helpers/fields";

const DISMISSED_ID = "yoast_wpseo_is_content_planner_banner_dismissed";
const RENDERED_ID = "yoast_wpseo_is_content_planner_banner_rendered";

/**
 * Creates a hidden input in the document body and returns it.
 *
 * @param {string} id    The element ID.
 * @param {string} value The initial value.
 * @returns {HTMLInputElement} The created input.
 */
const addInput = ( id, value ) => {
	const input = document.createElement( "input" );
	input.type = "hidden";
	input.id = id;
	input.value = value;
	document.body.appendChild( input );
	return input;
};

afterEach( () => {
	document.body.innerHTML = "";
} );

describe( "getIsBannerDismissedFromInput", () => {
	it( "returns false when the input does not exist", () => {
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );

	it( "returns false when the input value is '0'", () => {
		addInput( DISMISSED_ID, "0" );
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );

	it( "returns true when the input value is '1'", () => {
		addInput( DISMISSED_ID, "1" );
		expect( getIsBannerDismissedFromInput() ).toBe( true );
	} );
} );

describe( "getIsBannerRenderedFromInput", () => {
	it( "returns false when the input does not exist", () => {
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );

	it( "returns false when the input value is '0'", () => {
		addInput( RENDERED_ID, "0" );
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );

	it( "returns true when the input value is '1'", () => {
		addInput( RENDERED_ID, "1" );
		expect( getIsBannerRenderedFromInput() ).toBe( true );
	} );
} );

describe( "setBannerRenderedInput", () => {
	it( "sets the input value to '1'", () => {
		const input = addInput( RENDERED_ID, "0" );
		setBannerRenderedInput();
		expect( input.value ).toBe( "1" );
	} );

	it( "does nothing when the input does not exist", () => {
		expect( () => setBannerRenderedInput() ).not.toThrow();
	} );
} );

describe( "setBannerDismissedInput", () => {
	it( "sets the input value to '1'", () => {
		const input = addInput( DISMISSED_ID, "0" );
		setBannerDismissedInput();
		expect( input.value ).toBe( "1" );
	} );

	it( "does nothing when the input does not exist", () => {
		expect( () => setBannerDismissedInput() ).not.toThrow();
	} );
} );
