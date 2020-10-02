import { determineStem as determineStemEnglish } from "../../src/languages/legacy/morphology/english/determineStem";
import retrieveStemmer from "../../src/languages/legacy/helpers/retrieveStemmer";
import getMorphologyData from "../specHelpers/getMorphologyData";

describe( "tests whether the correct stemming function is retrieved", () => {
	it( "checks that a stemming function is returned for a given locale if there is a stemming function for that locale" +
		"and morphology data is available", () => {
		const morphologyData = getMorphologyData( "en" );

		expect( retrieveStemmer( "en", morphologyData ) ).toEqual( determineStemEnglish );
	} );

	it( "checks that an identity function is returned for a given locale if there is a stemming function for that locale" +
		"but morphology data is not available", () => {
		expect( retrieveStemmer( "en", false )( "test" ) ).toEqual( "test" );
	} );

	it( "checks that an identity function is returned for a given locale if there is no stemming function for that locale" +
		"and morphology data is not available", () => {
		expect( retrieveStemmer( "fr", false )( "test" ) ).toEqual( "test" );
	} );
} );
