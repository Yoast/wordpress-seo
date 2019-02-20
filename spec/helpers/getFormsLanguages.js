import getFormsLanguages from "../../src/helpers/getFormsLanguages";

describe( "Checks which languages have morphology support in YoastSEO.js", function() {
	it( "returns an array of languages that have morphology support", function() {
		expect( getFormsLanguages() ).toEqual( [ "en" ] );
	} );
} );
