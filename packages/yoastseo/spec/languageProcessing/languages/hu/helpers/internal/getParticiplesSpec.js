import getParticiples from "../../../../../../src/languageProcessing/languages/hu/helpers/internal/getParticiples";

describe( "Test for matching Hungarian participles", function() {
	it( "returns matched participles with 've' at the end.", function() {
		const sentence = "Az autó le van fedve.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "fedve" ] );
	} );

	it( "returns matched participles with 've' at the end followed by the auxiliary.", function() {
		const sentence = "Az asztal terítve van.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "terítve" ] );
	} );

	it( "returns matched participles with 'va' at the end.", function() {
		const sentence = "A függöny ki van mosva.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "mosva" ] );
	} );

	it( "returns matched participles with 'ra' at the end.", function() {
		const sentence = "A fa kivágásra került.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "kivágásra" ] );
	} );

	it( "returns matched participles with 're' at the end.", function() {
		const sentence = "Az épület megvételre került.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "megvételre" ] );
	} );

	it( "returns matched participles with 'ódni' at the end.", function() {
		const sentence = "A probléma meg fog oldódni.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "oldódni" ] );
	} );

	it( "returns matched participles with 'ődni' at the end.", function() {
		const sentence = "Az ügy rosszul fog végződni.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "végződni" ] );
	} );
} );
