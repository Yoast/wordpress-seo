import parseSlug from "../../../../src/languageProcessing/helpers/url/parseSlug";

describe( "A test to parse slug", () => {
	it( "parses slug", () => {
		expect( parseSlug( "cats-color-types" ) ).toBe( "cats color types" );
	} );

	it( "parses slug with empty string", () => {
		expect( parseSlug( "" ) ).toBe( "" );
	} );

	it( "parses slug with periods", () => {
		expect( parseSlug( "ubuntu-26.04-available" ) ).toBe( "ubuntu 26 04 available" );
	} );

	it( "parses slug with underscores and periods", () => {
		expect( parseSlug( "ubuntu_26.04_available" ) ).toBe( "ubuntu 26 04 available" );
	} );
} );
