import isPassiveSentence from "../../../../../src/languageProcessing/languages/he/helpers/isPassiveSentence.js";

describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice with binyan pa'al", function() {
		expect( isPassiveSentence( "אני רואה את השמים." ) ).toBe( false );
	} );

	it( "returns active voice with binyan pi'el", function() {
		expect( isPassiveSentence( "החומצה מאכלת את הברזל." ) ).toBe( false );
	} );

	it( "returns active voice with binyan hif'il", function() {
		expect( isPassiveSentence( "הוא הקריא ספר." ) ).toBe( false );
	} );

	it( "returns passive voice with binyan nif'al", function() {
		// Passive: נאכל.
		expect( isPassiveSentence( "התפוח נאכל על ידי הילדה." ) ).toBe( true );
	} );

	it( "returns passive voice with binyan pu'al", function() {
		// Passive: מאוכל.
		expect( isPassiveSentence( "הברזל מאוכל על ידי החומצה." ) ).toBe( true );
	} );

	it( "returns passive voice with binyan huf'al", function() {
		// Passive: הוחזק.
		expect( isPassiveSentence( "הכדור הוחזק ביד." ) ).toBe( true );
	} );

	it( "returns passive voice with binyan nif'al where the last letter of the root changes in non-final position", function() {
		// Passive: נערכו.
		expect( isPassiveSentence( "המשחקים הראשונים נערכ‎ו בשנת 1953 באלכסנדריה שבמצרים." ) ).toBe( true );
	} );

	it( "returns passive voice with binyan pu'al where the last letter of the root changes in non-final position", function() {
		// Passive: בורכה.
		expect( isPassiveSentence( "היא בורכה על ידי משפחתה." ) ).toBe( true );
	} );

	it( "returns passive voice with binyan huf'al where the last letter of the root changes in non-final position", function() {
		// Passive: הוסמכה.
		expect( isPassiveSentence( "היא הוסמכ‎ה על ידי הממשלה." ) ).toBe( true );
	} );
} );
