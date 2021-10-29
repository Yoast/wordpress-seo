import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import ArabicResearcher from "../../../../src/languageProcessing/languages/ar/Researcher";
import HungarianResearcher from "../../../../src/languageProcessing/languages/hu/Researcher";
import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult";
import Paper from "../../../../src/values/Paper";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice for periphrastic language", function() {
		const paper = new Paper( "Once a week, Tom cleans the house." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for periphrastic language", function() {
		// Passive: is cleaned.
		const paper = new Paper( "Once a week, the house is cleaned by Tom." );
		const researcher = new EnglishResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	 // For now the specs for Arabic and Hungarian are skipped. The shouldn't be skipped once Arabic and Hungarian passive voice are refactored.
	it( "returns active voice for morphological language", function() {
		const paper = new Paper( "كتب الولد الخطاب.", { locale: "ar" } );
		const researcher = new ArabicResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for morphological language", function() {
		// Passive: يُوازي.
		const paper = new Paper( "غير أنه يتعين أن يُوازي ذلك معالجة المسائل العرضية.", { locale: "ar" } );
		const researcher = new ArabicResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns active voice for both morphological and periphrastic language", function() {
		const paper = new Paper( "Aranyos kis macska", { locale: "hu" } );
		const researcher = new HungarianResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice for both morphological and periphrastic language", function() {
		// Passive: van plakátolva.
		const paper = new Paper( "Ki van plakátolva a képe", { locale: "hu" } );
		const researcher = new HungarianResearcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );
