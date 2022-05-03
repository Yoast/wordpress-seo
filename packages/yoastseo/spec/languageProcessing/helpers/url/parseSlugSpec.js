import parseSlug from "../../../../src/languageProcessing/helpers/url/parseSlug";

describe( "A test to parse slug", () => {
	it( "parses slug", () => {
		expect( parseSlug( "cats-color-types" ) ).toBe( "cats color types" );
	} );

	it( "parses slug", () => {
		expect( parseSlug( "" ) ).toBe( "" );
	} );
} );
