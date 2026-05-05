import { getIsBannerDismissedFromInput } from "../../../src/ai-content-planner/helpers/fields";

const INPUT_ID = "yoast_wpseo_is_content_planner_banner_dismissed";

const renderInput = ( value ) => {
	const input = document.createElement( "input" );
	input.id = INPUT_ID;
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
		renderInput( "1" );
		expect( getIsBannerDismissedFromInput() ).toBe( true );
	} );

	it( "returns false when the hidden input value is \"0\"", () => {
		renderInput( "0" );
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );
} );
