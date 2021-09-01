import isPassiveSentence from "../../../../../src/languageProcessing/languages/fa/helpers/isPassiveSentence.js";

describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice", function() {
		expect( isPassiveSentence( ".باران شروع شد" ) ).toBe( false );
	} );

	it( "returns active voice", function() {
		expect( isPassiveSentence( ".آنها دوچرخه را تعمیر می کنند" ) ).toBe( false );
	} );

	it( "returns passive voice for compound verbs", function() {
		// Passive: آسفالت شده.
		expect( isPassiveSentence( ".جاده آسفالت شده" ) ).toBe( true );
	} );

	it( "returns passive voice", function() {
		// Passive: آراسته.
		expect( isPassiveSentence( ".تصاویر آراسته بودند" ) ).toBe( true );
	} );
} );
