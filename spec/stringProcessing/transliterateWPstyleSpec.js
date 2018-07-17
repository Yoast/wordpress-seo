const transliterationObjects = require( "../../js/config/transliterationsWPstyle.js" );
const transliteration = require( "../../js/stringProcessing/transliterateWPstyle.js" );

describe( "a test for returning correct number of transliteration objects for different languages", function() {
	it( "returns only generic transliteration objects for Spanish.", function() {
		expect( transliterationObjects( "es_ES" ).length ).toBe( 309 );
	} );

	it( "returns only generic transliteration objects for English.", function() {
		expect( transliterationObjects( "en_EN" ).length ).toBe( 309 );
	} );

	it( "returns generic transliteration objects and language-specific transliteration objects for German.", function() {
		expect( transliterationObjects( "de_DE" ).length ).toBe( 317 );
	} );

	it( "returns generic transliteration objects and language-specific transliteration objects for Danish.", function() {
		expect( transliterationObjects( "da_DK" ).length ).toBe( 315 );
	} );

	it( "returns generic transliteration objects and language-specific transliteration objects for Catalan.", function() {
		expect( transliterationObjects( "ca_CA" ).length ).toBe( 310 );
	} );

	it( "returns generic transliteration objects and language-specific transliteration objects for Serbian.", function() {
		expect( transliterationObjects( "sr_RS" ).length ).toBe( 311 );
	} );

	it( "returns generic transliteration objects and language-specific transliteration objects for Bosnian.", function() {
		expect( transliterationObjects( "bs_BA" ).length ).toBe( 311 );
	} );
} );


describe( "a test for removing special characters from text using the WP standard", function() {
	it( "returns a Spanish string without special characters.", function() {
		expect( transliteration( "ñáéíóúüÑÁÉÍÓÚÜ", "es_ES" ) ).toBe( "naeiouuNAEIOUU" );
	} );

	it( "returns a Swedish string without special characters.", function() {
		expect( transliteration( "åÅäÄöÖéÉàÀ", "sv_SE" ) ).toBe( "aAaAoOeEaA" );
	} );

	it( "returns a Finnish string without special characters.", function() {
		expect( transliteration( "åÅäÄöÖžŽšŠ", "fi_FI" ) ).toBe( "aAaAoOzZsS" );
	} );

	it( "returns a Turkish string without special characters.", function() {
		expect( transliteration( "çğıİöşüâîûÇĞÖŞÜÂÎÛ", "tr_TR" ) ).toBe( "cgiIosuaiuCGOSUAIU" );
	} );

	it( "returns a Latvian string without special characters.", function() {
		expect( transliteration( "āĀčČēĒģĢīĪķĶļĻņŅšŠūŪžŽ", "lv" ) ).toBe( "aAcCeEgGiIkKlLnNsSuUzZ" );
	} );

	it( "returns a German string without special characters.", function() {
		expect( transliteration( "äüößÄÜÖẞ", "de_DE" ) ).toBe( "aeueoessAeUeOeSS" );
	} );

	it( "returns a Danish string without special characters.", function() {
		expect( transliteration( "åÅææÆÆøØéÉ", "da_DK" ) ).toBe( "aaAaaeaeAeAeoeOeeE" );
	} );

	it( "returns a Dutch string without special characters.", function() {
		expect( transliteration( "çÇñÑèÈêÊéÉëËôÔöÖïÏüÜäÄ", "nl_NL" ) ).toBe( "cCnNeEeEeEeEoOoOiIuUaA" );
	} );

	it( "returns an unchanged string for a non-existing locale.", function() {
		expect( transliteration( "abc", "qxz" ) ).toBe( "abc" );
	} );

	it( "returns an unchanged string for an empty locale.", function() {
		expect( transliteration( "abc", "" ) ).toBe( "abc" );
	} );

	it( "returns an unchanged string for no locale.", function() {
		expect( transliteration( "abc" ) ).toBe( "abc" );
	} );
} );
