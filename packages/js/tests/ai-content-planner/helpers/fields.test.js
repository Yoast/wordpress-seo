import {
	getIsBannerDismissedFromInput,
	getIsBannerRenderedFromInput,
	setBannerRenderedInput,
	setBannerDismissedInput,
} from "../../../src/ai-content-planner/helpers/fields";

const DISMISSED_INPUT_ID = "yoast_wpseo_is_content_planner_banner_dismissed";
const RENDERED_INPUT_ID = "yoast_wpseo_is_content_planner_banner_rendered";

const renderInput = ( id, value ) => {
	const input = document.createElement( "input" );
	input.id = id;
	input.type = "hidden";
	input.value = value;
	document.body.appendChild( input );
};

describe( "getIsBannerDismissedFromInput", () => {
	afterEach( () => {
		document.body.innerHTML = "";
	} );

	it( "returns true when the hidden input is absent so a server-side filter can hide the banner", () => {
		expect( getIsBannerDismissedFromInput() ).toBe( true );
	} );

	it( "returns true when the hidden input value is \"1\"", () => {
		renderInput( DISMISSED_INPUT_ID, "1" );
		expect( getIsBannerDismissedFromInput() ).toBe( true );
	} );

	it( "returns false when the hidden input value is \"0\"", () => {
		renderInput( DISMISSED_INPUT_ID, "0" );
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );
} );

describe( "getIsBannerRenderedFromInput", () => {
	afterEach( () => {
		document.body.innerHTML = "";
	} );

	it( "returns false when the hidden input is absent", () => {
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );

	it( "returns true when the hidden input value is \"1\"", () => {
		renderInput( RENDERED_INPUT_ID, "1" );
		expect( getIsBannerRenderedFromInput() ).toBe( true );
	} );

	it( "returns false when the hidden input value is \"0\"", () => {
		renderInput( RENDERED_INPUT_ID, "0" );
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );
} );

describe( "setBannerRenderedInput", () => {
	afterEach( () => {
		document.body.innerHTML = "";
	} );

	it( "sets the hidden input value to \"1\"", () => {
		renderInput( RENDERED_INPUT_ID, "0" );
		setBannerRenderedInput();
		expect( document.getElementById( RENDERED_INPUT_ID ).value ).toBe( "1" );
	} );

	it( "does nothing when the hidden input is absent", () => {
		expect( () => setBannerRenderedInput() ).not.toThrow();
	} );
} );

describe( "setBannerDismissedInput", () => {
	afterEach( () => {
		document.body.innerHTML = "";
	} );

	it( "sets the hidden input value to \"1\"", () => {
		renderInput( DISMISSED_INPUT_ID, "0" );
		setBannerDismissedInput();
		expect( document.getElementById( DISMISSED_INPUT_ID ).value ).toBe( "1" );
	} );

	it( "does nothing when the hidden input is absent", () => {
		expect( () => setBannerDismissedInput() ).not.toThrow();
	} );
} );
