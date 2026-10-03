import getTransliterations, { transliterations } from "../../src/config/getTransliterations";

describe( "A test for retrieving transliterations for a specific locale", () => {
	it( "should return the transliteration object for `nbnn` when the locale is either 'nb_NO' or 'nn_NO'", () => {
		expect( getTransliterations( "nb_NO" ) ).toEqual( transliterations.nbnn );
		expect( getTransliterations( "nn_NO" ) ).toEqual( transliterations.nbnn );
	} );
	it( "should return the transliteration object for `ca` when the locale is either 'bal' or 'ca'", () => {
		expect( getTransliterations( "bal" ) ).toEqual( transliterations.ca );
		expect( getTransliterations( "ca" ) ).toEqual( transliterations.ca );
	} );
	it( "should return the transliteration object from the array when the key for the specific locale is available in the array", () => {
		expect( getTransliterations( "es_AR" ) ).toEqual( transliterations.es );
		expect( getTransliterations( "pt_PT" ) ).toEqual( transliterations.pt );
	} );
	it( "should return an empty array when the key for the specific locale is not available in the array", () => {
		expect( getTransliterations( "jv_ID" ) ).toEqual( [] );
	} );
	it( "should return an empty array when no locale is passed", () => {
		expect( getTransliterations() ).toEqual( [] );
	} );
} );
