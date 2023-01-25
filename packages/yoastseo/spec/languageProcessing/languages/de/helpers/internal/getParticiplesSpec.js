import getParticiples from "../../../../../../src/languageProcessing/languages/de/helpers/internal/getParticiples.js";

describe( "Test for matching German participles", function() {
	it( "returns matched participles with 'ge' at the beginning.", function() {
		const sentence = "Jetzt wird der Mann ins Krankenhaus gebracht.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "gebracht" ] );
	} );

	it( "returns matched participles with 'be' in the middle and -[^s]t at the end.", function() {
		const sentence = "Es wird vorbereitet.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "vorbereitet" ] );
	} );

	it( "returns matched participles with 'ge' in the middle.", function() {
		const sentence = "Dem Verletzten wurde ein Verband angelegt.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "angelegt" ] );
	} );

	it( "returns matched participles with 'er' at the beginning and -[^s]t at the end.", function() {
		const sentence = "Das Passiv wurde uns erklärt.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "erklärt" ] );
	} );

	it( "returns matched participles with 'ver' at the beginning and -sst at the end.", function() {
		const sentence = "Er wird veranlasst.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "veranlasst" ] );
	} );

	it( "returns matched participles with 'iert'.", function() {
		const sentence = "Das wurde probiert.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "probiert" ] );
	} );

	it( "returns matched irregular participles.", function() {
		const sentence = "Das wurde gelassen.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "gelassen" ] );
	} );

	it( "returns an empty array when there is no participle", function() {
		const sentence = "Yahoo prüfte seitdem den Sachverhalt.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [] );
	} );

	it( "returns an empty array when there is no participle because the verb ends in [^s]st.", function() {
		const sentence = "De verhilfst.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
