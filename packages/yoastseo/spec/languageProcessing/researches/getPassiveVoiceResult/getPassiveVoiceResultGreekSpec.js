import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/el/Researcher";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice when no auxiliary is found and no morphological passive verb is found", function() {
		const paper = new Paper( "Αυτός ο μπαμπάς είναι φοβερός.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for a morphological passive construction", function() {
		const paper = new Paper( "Το σπίτι χτίστηκε από τον πατέρα μου.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice for non passive verb that looks like a passive (deponent verb)", function() {
		// Non Passive: σκέφτεται.
		const paper = new Paper( "Η γάτα μου σκέφτεται τί θα φάει μετά.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for a periphrastic passive construction with an auxiliary 'to be' and a passive participle", function() {
		const paper = new Paper( "Το φαγητο είναι μαγειρεμένο από την μαμά μου.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice for a sentence with an auxiliary 'to have' and a passive participle", function() {
		const paper = new Paper( "Έχω γραμμένη την εργασία μου.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice for a sentence with an auxiliary 'to have' and a active infinitive", function() {
		const paper = new Paper( "Σήμερα έχω λύσει πολλά προβλήματα.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice for a sentence with an auxiliary 'to have' and a passive infinitive, " +
		"but the infinitive is directly preceded by 'να' ", function() {
		const paper = new Paper( "Το άρθρο έχει να γραφθεί.", { locale: "el" } );
		const researcher = new Researcher( paper );

		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );
} );
