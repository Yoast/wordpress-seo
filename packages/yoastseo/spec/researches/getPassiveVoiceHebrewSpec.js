import passiveVoice from "../../src/researches/getPassiveVoice.js";
import Paper from "../../src/values/Paper.js";

describe( "detecting passive voice in sentences", function() {
	it( "returns active voice with binyan pa'al", function() {
		const paper = new Paper( "אני רואה את השמים.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with binyan pi'el", function() {
		const paper = new Paper( "החומצה מאכלת את הברזל.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns active voice with binyan hif'il", function() {
		const paper = new Paper( "הוא הקריא ספר.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 0 );
	} );

	it( "returns passive voice with binyan nif'al", function() {
		// Passive: נאכל.
		const paper = new Paper( "התפוח נאכל על ידי הילדה.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan pu'al", function() {
		// Passive: מאוכלס.
		const paper = new Paper( "הברזל מאוכלס על ידי החומצה.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );

	it( "returns passive voice with binyan huf'al", function() {
		// Passive: מרופא.
		const paper = new Paper( "כן, אני מרופא.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );
	it( "returns passive voice with binyan nif'al where the last letter of the root changes in non-final position", function() {
		// Passive: נערכו.
		const paper = new Paper( "המשחקים הראשונים נערכו בשנת 1953 באלכסנדריה שבמצרים.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );
	it( "returns passive voice with binyan pu'al where the last letter of the root changes in non-final position", function() {
		// Passive: בורכה.
		const paper = new Paper( "היא בורכה על ידי משפחתה.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );
	it( "returns passive voice with binyan hif'il where the last letter of the root changes in non-final position", function() {
		// Passive: הוסמכה.
		const paper = new Paper( "היא הוסמכה על ידי הממשלה.", { locale: "he_IL" } );
		expect( passiveVoice( paper ).passives.length ).toBe( 1 );
	} );
} );
