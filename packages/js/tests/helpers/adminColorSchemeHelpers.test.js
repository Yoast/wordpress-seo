import {
	getColorSchemeFromBodyClass,
	getColorSchemeBackground,
	getAdminSubmenuBackground,
} from "../../src/helpers/adminColorSchemeHelpers";

describe( "getColorSchemeFromBodyClass", () => {
	it( "extracts the color scheme from a body class string", () => {
		const bodyClass = "wp-admin wp-core-ui admin-color-midnight";
		expect( getColorSchemeFromBodyClass( bodyClass ) ).toBe( "midnight" );
	} );

	it( "returns 'fresh' when no color scheme is found", () => {
		const bodyClass = "wp-admin wp-core-ui";
		expect( getColorSchemeFromBodyClass( bodyClass ) ).toBe( "fresh" );
	} );

	it( "returns 'fresh' for an empty string", () => {
		expect( getColorSchemeFromBodyClass( "" ) ).toBe( "fresh" );
	} );

	it( "handles color schemes with the fresh scheme", () => {
		const bodyClass = "admin-color-fresh some-other-class";
		expect( getColorSchemeFromBodyClass( bodyClass ) ).toBe( "fresh" );
	} );

	it( "returns 'fresh' for null input", () => {
		expect( getColorSchemeFromBodyClass( null ) ).toBe( "fresh" );
	} );

	it( "returns 'fresh' for undefined input", () => {
		expect( getColorSchemeFromBodyClass( undefined ) ).toBe( "fresh" );
	} );

	it( "returns 'fresh' for non-string input", () => {
		expect( getColorSchemeFromBodyClass( 123 ) ).toBe( "fresh" );
		expect( getColorSchemeFromBodyClass( {} ) ).toBe( "fresh" );
	} );
} );

describe( "getColorSchemeBackground", () => {
	it( "returns the correct background for known color schemes", () => {
		expect( getColorSchemeBackground( "fresh" ) ).toBe( "#2c3338" );
		expect( getColorSchemeBackground( "midnight" ) ).toBe( "#26292c" );
		expect( getColorSchemeBackground( "light" ) ).toBe( "#fff" );
		expect( getColorSchemeBackground( "modern" ) ).toBe( "#1e1e1e" );
		expect( getColorSchemeBackground( "blue" ) ).toBe( "#4796b3" );
		expect( getColorSchemeBackground( "coffee" ) ).toBe( "#46403c" );
		expect( getColorSchemeBackground( "ectoplasm" ) ).toBe( "#413256" );
		expect( getColorSchemeBackground( "ocean" ) ).toBe( "#627c83" );
		expect( getColorSchemeBackground( "sunrise" ) ).toBe( "#be3631" );
	} );

	it( "returns the fresh background for unknown color schemes", () => {
		expect( getColorSchemeBackground( "unknown" ) ).toBe( "#2c3338" );
		expect( getColorSchemeBackground( "" ) ).toBe( "#2c3338" );
	} );
} );

describe( "getAdminSubmenuBackground", () => {
	it( "returns the correct background based on body class", () => {
		expect( getAdminSubmenuBackground( "admin-color-midnight" ) ).toBe( "#26292c" );
		expect( getAdminSubmenuBackground( "admin-color-ocean" ) ).toBe( "#627c83" );
	} );

	it( "returns the fresh background when no color scheme is in body class", () => {
		expect( getAdminSubmenuBackground( "wp-admin" ) ).toBe( "#2c3338" );
	} );
} );
