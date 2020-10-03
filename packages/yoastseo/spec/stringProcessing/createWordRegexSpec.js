/* eslint-disable no-irregular-whitespace */
import createWordRegex from "../../src/researches/stringProcessing/createWordRegex.js";

describe( "creates regex from keyword", function() {
	it( "returns a regex", function() {
		expect( createWordRegex( "keyword" ) ).toEqual(
			/(^|[ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])keyword($|([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
	} );
	it( "returns a regex - words with diacritics", function() {
		expect( createWordRegex( "maïs", "", false ) ).toEqual(
			/(^|[ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])maïs($|([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
		expect( createWordRegex( "Slovníček pojmû", "", false ) ).toEqual(
			/(^|[ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])Slovníček pojmû($|([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
	} );
	it( "returns a regex - words with characters that break regexes", function() {
		expect( createWordRegex( "keyword*" ) ).toEqual(
			/(^|[ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>'‘’‛`])keyword\*($|([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])|((['‘’‛`])([ \u00a0\u06d4\u061f\u060C\u061B \n\r\t.,()”“〝〞〟‟„"+\-;!¡?¿:\/»«‹›<>])))/gi
		);
	} );
} );
