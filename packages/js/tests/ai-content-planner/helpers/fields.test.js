import {
	getIsBannerDismissedFromInput,
	getIsBannerRenderedFromInput,
	setBannerDismissedInput,
	setBannerRenderedInput,
} from "../../../src/ai-content-planner/helpers/fields";

const DISMISSED_ID = "yoast_wpseo_is_content_planner_banner_dismissed";
const RENDERED_ID = "yoast_wpseo_is_content_planner_banner_rendered";

afterEach( () => {
	document.body.innerHTML = "";
} );

describe( "getIsBannerDismissedFromInput", () => {
	it( "returns true when the hidden input value is '1'", () => {
		document.body.innerHTML = `<input id="${ DISMISSED_ID }" value="1">`;
		expect( getIsBannerDismissedFromInput() ).toBe( true );
	} );

	it( "returns false when the hidden input value is '0'", () => {
		document.body.innerHTML = `<input id="${ DISMISSED_ID }" value="0">`;
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );

	it( "returns false when the hidden input value is empty", () => {
		document.body.innerHTML = `<input id="${ DISMISSED_ID }" value="">`;
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );

	it( "returns false when the input element does not exist", () => {
		expect( getIsBannerDismissedFromInput() ).toBe( false );
	} );
} );

describe( "getIsBannerRenderedFromInput", () => {
	it( "returns true when the hidden input value is '1'", () => {
		document.body.innerHTML = `<input id="${ RENDERED_ID }" value="1">`;
		expect( getIsBannerRenderedFromInput() ).toBe( true );
	} );

	it( "returns false when the hidden input value is '0'", () => {
		document.body.innerHTML = `<input id="${ RENDERED_ID }" value="0">`;
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );

	it( "returns false when the hidden input value is empty", () => {
		document.body.innerHTML = `<input id="${ RENDERED_ID }" value="">`;
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );

	it( "returns false when the input element does not exist", () => {
		expect( getIsBannerRenderedFromInput() ).toBe( false );
	} );
} );

describe( "setBannerRenderedInput", () => {
	it( "sets the input value to '1'", () => {
		document.body.innerHTML = `<input id="${ RENDERED_ID }" value="">`;
		setBannerRenderedInput();
		expect( document.getElementById( RENDERED_ID ).value ).toBe( "1" );
	} );

	it( "does not throw when the input element does not exist", () => {
		expect( () => setBannerRenderedInput() ).not.toThrow();
	} );

	it( "overwrites an existing non-empty value with '1'", () => {
		document.body.innerHTML = `<input id="${ RENDERED_ID }" value="0">`;
		setBannerRenderedInput();
		expect( document.getElementById( RENDERED_ID ).value ).toBe( "1" );
	} );
} );

describe( "setBannerDismissedInput", () => {
	it( "sets the input value to '1'", () => {
		document.body.innerHTML = `<input id="${ DISMISSED_ID }" value="">`;
		setBannerDismissedInput();
		expect( document.getElementById( DISMISSED_ID ).value ).toBe( "1" );
	} );

	it( "does not throw when the input element does not exist", () => {
		expect( () => setBannerDismissedInput() ).not.toThrow();
	} );

	it( "overwrites an existing non-empty value with '1'", () => {
		document.body.innerHTML = `<input id="${ DISMISSED_ID }" value="0">`;
		setBannerDismissedInput();
		expect( document.getElementById( DISMISSED_ID ).value ).toBe( "1" );
	} );
} );
