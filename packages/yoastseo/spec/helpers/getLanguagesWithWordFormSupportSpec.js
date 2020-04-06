import getLanguagesWithWordFormSupport from "../../src/helpers/getLanguagesWithWordFormSupport";

describe( "Checks which languages have morphology support in YoastSEO.js", function() {
	it( "returns an array of languages that have morphology support", function() {
		expect( getLanguagesWithWordFormSupport() ).toEqual( [ "en", "de", "nl", "es" ] );
	} );
} );
