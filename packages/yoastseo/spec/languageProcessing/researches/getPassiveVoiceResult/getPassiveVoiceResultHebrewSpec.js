import passiveVoice from "../../../../src/languageProcessing/researches/getPassiveVoiceResult.js";
import Paper from "../../../../src/values/Paper.js";
import Researcher from "../../../../src/languageProcessing/languages/he/Researcher";

describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice with binyan pa'al", function() {
		const paper = new Paper( "אני רואה את השמים.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with binyan pi'el", function() {
		const paper = new Paper( "החומצה מאכלת את הברזל.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with binyan hif'il", function() {
		const paper = new Paper( "הוא הקריא ספר.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice with binyan nif'al", function() {
		// Passive: נאכל.
		const paper = new Paper( "התפוח נאכל על ידי הילדה.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan pu'al", function() {
		// Passive: מאוכל.
		const paper = new Paper( "הברזל מאוכל על ידי החומצה.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan huf'al", function() {
		// Passive: הוחזק.
		const paper = new Paper( "הכדור הוחזק ביד.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan nif'al where the last letter of the root changes in non-final position", function() {
		// Passive: נערכו.
		const paper = new Paper( "המשחקים הראשונים נערכ‎ו בשנת 1953 באלכסנדריה שבמצרים.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan pu'al where the last letter of the root changes in non-final position", function() {
		// Passive: בורכה.
		const paper = new Paper( "היא בורכה על ידי משפחתה.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan huf'al where the last letter of the root changes in non-final position", function() {
		// Passive: הוסמכה.
		const paper = new Paper( "היא הוסמכ‎ה על ידי הממשלה.", { locale: "he_IL" } );
		const researcher = new Researcher( paper );
		expect( passiveVoice( paper, researcher ).passives.length ).toBe( 1 );
	} );
} );
