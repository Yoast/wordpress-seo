/**
 * @jest-environment jsdom
 */
import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/el/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		const paper = new Paper( "Αυτός ο μπαμπάς είναι φοβερός.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for a morphological passive construction", function() {
		const paper = new Paper( "Το σπίτι χτίστηκε από τον πατέρα μου.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	xit( "returns passive voice for a morphological passive construction with participle ending in -θεί", function() {
		const paper = new Paper( "", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	xit( "returns passive voice for a periphrastic passive construction with an auxiliary 'to be' and a passive participle", function() {
		// Change the sentence after the NSC provides a real sentence
		const paper = new Paper( "Η γάτα είναι σκέφτεται τί θα μετάμένος.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	xit( "returns passive voice for a periphrastic passive construction with an auxiliary 'to have' and a passive infinitive", function() {
		// Change the sentence after the NSC provides a real sentence
		const paper = new Paper( "Η γάτα έχω μετάμηθεί.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives ).toBe( 1 );
	} );

	xit( "returns passive voice for a periphrastic passive construction with an auxiliary 'to have' and a passive infinitive ending in -ηθεί", function() {
		// Change the sentence after the NSC provides a real sentence
		const paper = new Paper( "Η γάτα έχω μετάμηθεί.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives ).toBe( 1 );
	} );

	xit( "returns active voice for a sentence with an auxiliary 'to have' and a passive participle", function() {
		// Change the sentence after the NSC provides a real sentence
		const paper = new Paper( "Η γάτα έχω τί θα μετάημένες.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	xit( "returns active voice for a sentence with an auxiliary 'to have' and a active infinitive", function() {
		// Change the sentence after the NSC provides a real sentence
		const paper = new Paper( "Η γάτα έχω σκέφτε τί θα μετάμηθεί.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice for a sentence with an auxiliary 'to have' and a passive infinitive, " +
		"but the infinitive is directly preceded by 'να' ", function() {
		// Change the sentence after the NSC provides a real sentence
		const paper = new Paper( "Το άρθρο έχει να γραφθεί.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
