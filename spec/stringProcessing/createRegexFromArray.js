/* eslint-disable no-irregular-whitespace */
import arrayToRegex from "../../src/stringProcessing/createRegexFromArray.js";

describe( "a test creating a regex from an array with strings", function() {
	// This test is old and it should not pass, but it does!
	it( "adds start and end boundaries", function() {
		expect( "/((^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])a($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>]))|((^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])b($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>]))|((^|[ \n\r\t\.,'\(\)\"\+;!?:\/<>])c($|[ \n\r\t\.,'\(\)\"\+;!?:\/<>]))/gi" ).toMatch( arrayToRegex( [ "a", "b", "c" ] ) );
	} );

	it( "adds start and end boundaries by default", function() {
		expect( arrayToRegex( [ "a", "b", "c" ] ) ).toEqual(
			/((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])a($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))|((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])b($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))|((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])c($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))/gi
		);
	} );

	it( "adds start and end boundaries when explicitly asked to not disable them", function() {
		expect( arrayToRegex( [ "a", "b", "c" ], false ) ).toEqual(
			/((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])a($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))|((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])b($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))|((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])c($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))/gi
		);
	} );

	it( "does not add start and end boundaries when explicitly asked to disable them", function() {
		expect( arrayToRegex( [ "a", "b", "c" ], true ) ).toEqual( /(a)|(b)|(c)/gi );
	} );

	it( "does well with regexifying words containing symbols that break regexes", function() {
		expect( arrayToRegex( [ "keyword*" ], false ) ).toEqual(
			/((^|[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])keyword*($|((?=[ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))|((['‘’‛`])([ \u00a0 \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>]))))/gi
		);
	} );
} );
