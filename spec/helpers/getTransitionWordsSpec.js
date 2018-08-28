var getTransitionWords = require( "../../js/helpers/getTransitionWords.js" );

describe( "gets transition words, based on language", function() {
	var properties = [ "transitionWords", "twoPartTransitionWords" ];
	it( "checks if all properties are set for English", function() {
		var transitionWords = getTransitionWords( "en_US" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Spanish", function() {
		var transitionWords = getTransitionWords( "es_ES" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for French", function() {
		var transitionWords = getTransitionWords( "fr_FR" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for German", function() {
		var transitionWords = getTransitionWords( "de_DE" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Italian", function() {
		var transitionWords = getTransitionWords( "it_IT" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Portuguese", function() {
		var transitionWords = getTransitionWords( "pt_PT" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Russian", function() {
		var transitionWords = getTransitionWords( "ru_RU" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Catalan", function() {
		var transitionWords = getTransitionWords( "ca_ES" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set for Polish", function() {
		var transitionWords = getTransitionWords( "pl_PL" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );

	it( "checks if all properties are set if no locale is given", function() {
		var transitionWords = getTransitionWords( "" );
		expect( Object.keys( transitionWords ) ).toEqual( properties );
	} );
} );
