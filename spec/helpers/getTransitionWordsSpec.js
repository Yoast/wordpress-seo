import getTransitionWords from "../../src/helpers/getTransitionWords.js";

describe( "gets transition words, based on language", function() {
	const properties = [ "transitionWords", "twoPartTransitionWords" ];
	it( "checks if all properties are set for English", function() {
		const transitionWords = getTransitionWords( "en_US" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Spanish", function() {
		const transitionWords = getTransitionWords( "es_ES" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for French", function() {
		const transitionWords = getTransitionWords( "fr_FR" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for German", function() {
		const transitionWords = getTransitionWords( "de_DE" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Italian", function() {
		const transitionWords = getTransitionWords( "it_IT" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Portuguese", function() {
		const transitionWords = getTransitionWords( "pt_PT" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Russian", function() {
		const transitionWords = getTransitionWords( "ru_RU" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Catalan", function() {
		const transitionWords = getTransitionWords( "ca_ES" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Polish", function() {
		const transitionWords = getTransitionWords( "pl_PL" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Swedish", function() {
		const transitionWords = getTransitionWords( "sv_SE" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set if no locale is given", function() {
		const transitionWords = getTransitionWords( "" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );
} );
